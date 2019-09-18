import config from '../config/config';
import { Application } from 'express';

abstract class BaseRoutes {
	protected url: string;
	abstract routes(app: Application): void;

	constructor() {
		this.url = config.app.baseUrl + config.app.version;
	}

}

export default BaseRoutes;