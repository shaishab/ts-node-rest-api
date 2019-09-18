import { Request, Response } from "express";
import AuthenticationService from '../services/authenticaton.service';

export default class AuthenticationController {
	constructor() {
	}

	async login(req: Request, res: Response): Promise<any> {
		return AuthenticationService.create(req, res);
	}

	async getUser(req: Request, res: Response): Promise<any> {
		return AuthenticationService.getUser(req, res);
	}

}
