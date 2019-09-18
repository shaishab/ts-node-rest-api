import { Application, Request, Response } from "express";
import BaseRoutes from './base.routes';
import HealthController from '../controllers/health.controller';

export class HealthRouter extends BaseRoutes {
	public healthController: HealthController;

	constructor() {
		super();
		this.healthController = new HealthController();
	}

	public routes(app: Application): void {
		app.route(this.url + '/')
			.get((req: Request, res: Response) => {
				return res.status(200).send({ message: 'welcome' });
			});

		app.route(this.url + '/health').get(this.healthController.getHealth);

	}
}