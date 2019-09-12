
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import path from 'path';
// import glob from 'glob';
// import appRoot from 'app-root-path';
// import { union, isString, isArray } from 'lodash';
// import assets from '../assets/all';

import DynamicRouteLoader from '../../routes'

class Express {
	/**
	 * Create the express object
	 */
	public app: express.Application;
	// public app: any;

	/**
	 * Initializes the express server
	 */
	constructor () {
		this.app = express();
		this.initMiddleware();
		this.mountRoutes();
	}

	private initMiddleware (): void {
		this.app.set('showStackError', true);

		// secure apps by setting various HTTP headers
		this.app.use(helmet());
		// sets to allow all origin
		this.app.use(cors());
		// sets to compress response bodies for all request
		this.app.use(compression());


		// Passing the request url to environment locals
		this.app.use((req:any, res:any, next:any) => {
			res.locals.url = req.protocol + '://' + req.headers.host + req.url;
			next();
		});

		// Request body parsing middleware should be above methodOverride
		this.app.use(bodyParser.urlencoded({
			extended: true
		}));
		this.app.use(bodyParser.json());

		// sets to override the req.method property with a new value
		this.app.use(methodOverride());

		this.app.use(cookieParser());

	}

	/*
	private getGlobedFiles(globPatterns:any) {

		// URL paths regex
		var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

		// The output array
		let output:string[] = []

		// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
		if (isArray(globPatterns)) {
			for(let globPattern of globPatterns) {
				output = union(output, this.getGlobedFiles(globPattern));
			}
		} else if (isString(globPatterns)) {
		  if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		  } else {
			let files = glob.sync(globPatterns);
			output = union(output, files);
		  }
		}
		return output;
	};
	*/

	/**
	 * Mounts all the defined routes
	 */
	private async mountRoutes(): Promise<any> {

		console.log('DynamicRoutess=====', DynamicRouteLoader);
		console.log('DynamicRoutess=====', DynamicRouteLoader.routes);
		for (let routeName in DynamicRouteLoader.routes) {
			console.log('routeName======', routeName);
			new DynamicRouteLoader(routeName.toString(), this.app);
		}
		// for (let routePath of this.getGlobedFiles(appRoot.path + assets.routes)) {
		// 	console.log('route path===',routePath);
		// 	let  Routes  = require(path.resolve(routePath));
		// 	const Routes = await import(path.resolve(routePath));
		// 	console.log('Routes=======', Routes)
		// 	console.log('Routes=======', Routes)
		// 	new Routes().routes(this.app);
		// }
	}
}

/** Export the express module */
export default Express;