import { Application } from 'express';

export default interface IRoute {
	routes(app: Application): void;
}