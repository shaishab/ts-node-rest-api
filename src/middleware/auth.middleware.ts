
import { Request, Response, NextFunction } from 'express';
import IAuthToken from '../interfaces/authToken.interface';
import RequestWithToken from '../interfaces/requestWithToken.interface';
import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4';
import fs from 'fs';
import config from '../config/config';
import CryptoHelper from '../helpers/CryptoHelper';
import AuthTokenMissingException from '../exceptions/AuthTokenMissingException';
import AuthTokenInvalidException from '../exceptions/AuthTokenInvalidException';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import NotAuthenticatedException from '../exceptions/NotAuthenticatedException';
import CatchException from '../exceptions/CatchException';


export default class AuthMiddleware {
  cryptoHelper: CryptoHelper;
  constructor() {
    this.cryptoHelper = new CryptoHelper();
  }

  private jwtSign(payload: any): any {
    let privateKEY = fs.readFileSync(config.session.rsaPrivateKey, 'utf8');
    let verifyOptions = {
      issuer: config.session.issuer,
      subject: config.session.subject,
      audience: config.session.audience,
      expiresIn: config.session.tokenLife + 'm',
      algorithm: config.session.algorithm
    };
    return jwt.sign(payload, privateKEY, verifyOptions);
  }

  private jwtVerify(token: string): any {
    let publicKEY = fs.readFileSync(config.session.rsaPublicKey, 'utf8');
    let verifyOptions = {
      issuer: config.session.issuer,
      subject: config.session.subject,
      audience: config.session.audience,
      expiresIn: config.session.tokenLife + 'm',
      algorithm: config.session.algorithm
    };
    return jwt.verify(token, publicKEY, verifyOptions);
  }

  private async isValidToken(token: string): Promise<boolean> {
    try {
      await this.jwtVerify(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  private generateNewToken(req: Request): string {
    let deviceId: string = req.headers && req.headers.deviceId ? req.headers.deviceId.toString() : '';
    let contextId: string = uuidv4();

    let tokenInfo: IAuthToken = {
      contextId: contextId,
      deviceId: deviceId,
      userId: '',
      username: ''
    };
    const payload = {
      data: this.cryptoHelper.encrypt(JSON.stringify(tokenInfo), config.session.tokenEncryptionKey)
    };

    return this.jwtSign(payload);
  }

  public async createToken(req: Request): Promise<any> {
    try {
      console.log('******called create token with the body ==', req.body);

      let previousToken: string = req.cookies.authToken || '';
      if (previousToken) {
        let isExist = await this.isValidToken(previousToken);
        if (isExist) {
          return req.cookies.authToken;
        }
      }

      let token: string = this.generateNewToken(req);
      console.log('generated new token', token);
      return token;

    } catch (err) {
      console.log('create error========', err);
      return new CatchException(err);
    }
  };

  public async updateTokenInfo(req: Request, reqObj: IAuthToken): Promise<any> {
    try {
      console.log('****** update token information================');
      let previousToken: string = req.cookies.authToken;
      let isValidPrevToken: boolean = await this.isValidToken(previousToken);
      if (!isValidPrevToken) {
        return new AuthTokenInvalidException();
      }

      let decoded = await this.jwtVerify(previousToken);
      decoded = this.cryptoHelper.decrypt(decoded.data, config.session.tokenEncryptionKey);
      decoded = JSON.parse(decoded);

      let tokenInfo: IAuthToken = {
        deviceId: decoded.deviceId,
        contextId: decoded.contextId,
        userId: decoded.userId,
        username: decoded.username
      };

      for (let field in reqObj) {
        if (reqObj.hasOwnProperty(field)) {
          (tokenInfo as any)[field] = (reqObj as any)[field];
        }
      }

      const payload = {
        data: this.cryptoHelper.encrypt(JSON.stringify(tokenInfo), config.session.tokenEncryptionKey)
      };

      let token = await this.jwtSign(payload);
      return token;
    } catch (err) {
      return new CatchException(err);
    }
  };

  public async isAuthorized(req: RequestWithToken, res: Response, next: NextFunction): Promise<any> {
    try {
      let reqToken = req.cookies.authToken;
      if (!reqToken) {
        next(new AuthTokenMissingException());
      }

      let decoded = this.jwtVerify(reqToken);
      decoded = this.cryptoHelper.decrypt(decoded.data, config.session.tokenEncryptionKey);
      decoded = JSON.parse(decoded);
      if (decoded.deviceId !== req.headers.deviceid) {
        next(new NotAuthorizedException());
      }
      let tokenInfo: IAuthToken = {
        contextId: decoded.contextId,
        deviceId: decoded.deviceId,
        userId: decoded.userId,
        username: decoded.username
      };
      const payload = {
        data: this.cryptoHelper.encrypt(JSON.stringify(tokenInfo), config.session.tokenEncryptionKey)
      };

      /**
       * After verify we are doing jwtSign to increase the token life time
       */
      let signedToken = await this.jwtSign(payload);
      res.cookie('authToken', signedToken, { httpOnly: true });

      req.token = tokenInfo;
      next();
    } catch (err) {
      console.log('no token err==========', err);
      next(new CatchException(err));
    }
  }

  public async isAuthenticated(req: RequestWithToken, res: Response, next: NextFunction): Promise<any> {
    try {
      /**
       * we are assumeing that userId will be available after successfully logged only
       */
      if (req.token && req.token.userId) {
        next();
      } else {
        next(new NotAuthenticatedException());
      }
    } catch (err) {
      console.log('no userId==========', err);
      next(new CatchException(err));
    }
  };
}
