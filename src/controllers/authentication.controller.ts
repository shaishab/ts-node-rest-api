import { Request, Response } from "express";
import { AuthenticationService } from '../services/authenticaton.service';

export default class AuthenticationController {
	private authenticationService: AuthenticationService;
	constructor() {
		this.authenticationService = new AuthenticationService();
	}

	public async login(req: Request, res: Response): Promise<any> {
		return this.authenticationService.create(req, res);
	}

	public async getUser(req: Request, res: Response): Promise<any> {
		return this.authenticationService.create(req, res);
	}

}
