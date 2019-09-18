import HttpException from './HttpException';

class AuthTokenInvalidException extends HttpException {
  constructor(error?: Error) {
    super(403, '01', error && error.message || 'Authentication token invalid');
  }
}

export default AuthTokenInvalidException;
