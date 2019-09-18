import { Application } from "express";
import BaseRoutes from './base.routes';
import AuthMiddleware from '../middleware/auth.middleware';
import AuthenticationController from '../controllers/authentication.controller';

export class AuthenticationRouter extends BaseRoutes {
	private jwth: AuthMiddleware;
	private authenticationController: AuthenticationController;

	constructor() {
		super();
		this.jwth = new AuthMiddleware();
		this.authenticationController = new AuthenticationController();
	}

	public routes(app: Application): void {

		app.route(this.url + '/login')
			.post(this.authenticationController.login);

		app.route(this.url + '/user')
			.get(this.jwth.isAuthorized, this.authenticationController.getUser);

	}
}