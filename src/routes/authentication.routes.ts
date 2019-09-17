import { Application } from "express";
import IRoutes from '../interfaces/route.interface'
import config from '../config/config';
import AuthMiddleware from '../middleware/auth.middleware';
import AuthenticationController from '../controllers/authentication.controller';

export class AuthenticationRouter implements IRoutes {

	private url: string;
	private jwth: AuthMiddleware;
	private authenticationController: AuthenticationController;

	constructor() {
		this.url = config.app.baseUrl + config.app.version;
		this.jwth = new AuthMiddleware();
		this.authenticationController = new AuthenticationController();
	}

	public routes(app: Application): void {

		app.route(this.url + '/login').post(this.authenticationController.login);

		app.route(this.url + '/user').post(this.jwth.isAuthorized, this.authenticationController.getUser);

	}
}