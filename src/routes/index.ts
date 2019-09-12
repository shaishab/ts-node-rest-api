import { Application } from "express";
import HealthRoutes from './health.routes';

/**
 * After creating new routes we have to include that in this file
 */
const routeClasses: any = {
	HealthRoutes
};

class DynamicRouteLoader {

	static routes: any = routeClasses;

	constructor(className: string, app: Application) {
		return new routeClasses[className]().routes(app);
	}

}

export default DynamicRouteLoader;