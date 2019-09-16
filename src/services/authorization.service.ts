
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import uuidv4 from 'uuid/v4';
import config from '../config/config';
import IAuthToken from '../interfaces/authToken.interface';
import CryptoHelper from '../helpers/CryptoHelper';
import AuthTokenInvalidException from '../exceptions/AuthTokenInvalidException';


export class AuthorizationService {
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
  };

  private createTokens(req: Request): string {
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

  public async create(req: Request, res: Response): Promise<any> {
    try {
      console.log('******call to create new token with body', req.body);

      let previousToken: string = req.cookies.authToken;
      if (previousToken) {
        let isExist = await this.isValidToken(previousToken);
        if (isExist) {
          return res.status(200).json({ success: true });
        }
      }

      console.log('creating new tokens');
      let token: string = await this.createTokens(req);
      console.log('created new tokens', token);
      res.cookie('authToken', token, { httpOnly: true });
      return res.status(200).json({ message: 'success' });

    } catch (err) {
      console.log('create error========', err);
      return res.status(500).json({ success: false, errorMsg: err.message });
    }
  };

  public async updateTokenInfo(req: Request, reqObj: AuthToken, res: Response) {
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
      res.cookie('authToken', token, { httpOnly: true });
      return ({ success: true });
    } catch (err) {
      console.log('update token info error', err);
      return ({ success: false, httpCode: 500, opCode: '99', error: err.message });
    }
  };
}
