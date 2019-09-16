import HttpException from './HttpException';

class NotAuthenticatedException extends HttpException {
  constructor() {
    super(401, '01', 'You are not logged in');
  }
}

export default NotAuthenticatedException;
