import HttpException from './HttpException';

class AuthTokenMissingException extends HttpException {
  constructor() {
    super(403, '01', 'Authentication token missing');
  }
}

export default AuthTokenMissingException;
