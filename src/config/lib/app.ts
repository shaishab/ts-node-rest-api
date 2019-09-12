import config from '../config';
import Express from './express';
import { Database } from './database';


class App {
	// Connect the Database Pool
	public async connectDatabase (): Promise<any> {
		console.log('Database :: connecting...');
		return await Database.connect(config.database.url);
	}

	// Loads your Server
	public async startServer (): Promise<any> {
		console.log('Server :: starting...');
		return new Express().app;
	}

}

export default new App;