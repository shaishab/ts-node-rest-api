import APP from './config/lib/app';
import config from './config/config';
import chalk from 'chalk';

let startServer = async () => {
	try {
    console.log('Application :: Booting...');
		await APP.connectDatabase();
		let app = await APP.startServer();
    app.listen(config.port, () => {
      console.info(chalk.green(`${config.app.title} server started on port ${config.port}`));
      console.info(chalk.green('Serving requests on url ' + config.app.baseUrl + config.app.version));
    });
  } catch(err) {
    console.info('server error====', err);
  }

};
startServer();