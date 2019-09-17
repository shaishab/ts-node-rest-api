import { Request } from 'express';
import IAuthToken from './authToken.interface';

interface RequestWithToken extends Request {
  token?: IAuthToken;
}

export default RequestWithToken;
