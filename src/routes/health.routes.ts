import { Application, Request, Response } from "express";
import IRoutes from '../interfaces/route.interface'
import config from '../config/config';
import HealthController from '../controllers/health.controller';

export class HealthRouter implements IRoutes {

	public url: string;
	public healthController: HealthController;

	constructor() {
		this.url = config.app.baseUrl + config.app.version;
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