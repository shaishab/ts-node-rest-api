import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
	const status = error.status || 500;
	const opCode = error.code || '00';
	const message = error.message || 'Internal Server Error';
	response
		.status(status)
		.send({
			message,
			status,
			opCode
		});
}

export default errorMiddleware;
