import { Application, Request, Response } from "express";
import config from '../config/config';
import HealthController from '../controllers/health.controller';

export default class HealthRoutes {

	public url: string;
	public healthController: HealthController;

	constructor() {
		this.url = config.app.baseUrl + config.app.version;
		this.healthController = new HealthController();
	}

	public routes(app:Application): void {
		app.route(this.url + '/')
			.get((req: Request, res: Response) => {
				return res.status(200).send({ message: 'welcome' });
			});

		app.route(this.url + '/health').get(this.healthController.getHealth);

	}
}