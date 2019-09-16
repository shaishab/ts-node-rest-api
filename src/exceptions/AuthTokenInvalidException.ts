import HttpException from './HttpException';

class AuthTokenInvalidException extends HttpException {
  constructor() {
    super(403, '01', 'Authentication token invalid');
  }
}

export default AuthTokenInvalidException;
