import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
	const status = error.status || 500;
	const errors = error.errors || [{ code: '01', message: 'Internal Server Error' }];
	response
		.status(status)
		.send({ errors });
}

export default errorMiddleware;
