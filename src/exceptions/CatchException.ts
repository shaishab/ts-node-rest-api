import HttpException from './HttpException';

class CatchException extends HttpException {
  constructor(error: Error) {
    super(500, '99', error.message || 'Internal server error');
  }
}

export default CatchException;
