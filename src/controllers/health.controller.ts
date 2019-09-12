import { Request, Response } from "express";
import config from '../config/config';
let num = Math.floor(Math.random() * 10000);

class HealthController {

	constructor() {
		console.log('load controller')
	}

	async getHealth(req: Request, res: Response): Promise<any> {
		return res.status(200).send(`I am healthy! from server ${num} version ${config.app.version}`);
	}

}

export default HealthController;