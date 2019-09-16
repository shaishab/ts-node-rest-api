
import { Response, NextFunction } from 'express';
import IAuthToken from '../interfaces/authToken.interface';
import RequestWithToken from '../interfaces/requestWithToken.interface';
import jwt from 'jsonwebtoken'; r
import fs from 'fs';
import config from '../config/config';
import CryptoHelper from '../helpers/CryptoHelper';
import AuthTokenMissingException from '../exceptions/AuthTokenMissingException';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import NotAuthenticatedException from '../exceptions/NotAuthenticatedException';


export class AuthMiddleware {
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

  public async authorized(req: RequestWithToken, res: Response, next: NextFunction): Promise<any> {
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

      let signedToken = await this.jwtSign(payload);
      res.cookie('authToken', signedToken, { httpOnly: true });

      req.token = tokenInfo;
      next();
    } catch (err) {
      console.log('no token err==========', err);
      next(new AuthTokenMissingException());
    }
  }

  public async authenticated(req: RequestWithToken, res: Response, next: NextFunction): Promise<any> {
    try {
      if (req.token && req.token.userId) {
        next();
      } else {
        next(new NotAuthenticatedException());
      }
    } catch (err) {
      console.log('no bank token==========', err);
      next(new NotAuthenticatedException());
    }
  };
}
