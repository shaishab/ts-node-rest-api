
import { Request, Response } from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import CatchException from '../exceptions/CatchException';

export class AuthenticationService {
  private authMiddleware: AuthMiddleware;
  constructor() {
    this.authMiddleware = new AuthMiddleware();
  }

  public async create(req: Request, res: Response): Promise<any> {
    try {
      let token: string = await this.authMiddleware.createToken(req);
      console.log('created new tokens', token);
      res.cookie('authToken', token, { httpOnly: true });
      return res.status(200).json({ message: 'success' });
    } catch (err) {
      return new CatchException(err);
    }
  };

  public async getUser(req: Request, res: Response): Promise<any> {
    try {
      return res.status(200).json({ user: { userId: '12345', name: 'Shaishab Roy' } });
    } catch (err) {
      return new CatchException(err);
    }
  };
}
