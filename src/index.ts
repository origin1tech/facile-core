
// Import Dependencies.
import * as events from 'events';
import { resolve, join } from 'path';
import * as express from 'express';
import * as Boom from 'boom';
import { LoggerInstance, Logger, transports} from 'winston';
import { wrap, create, badRequest, unauthorized, forbidden, notFound, notImplemented } from 'boom';
import { createServer } from 'http';
import { createServer as createServerHttps } from 'https';
import { Server } from 'net';
import { readFileSync } from 'fs';
import { extend, isPlainObject, each, isFunction, isString } from 'lodash';
import { parseFlags } from './utils';

// Import Interfaces.
import { ICertificate, IConfig, IRouters, IRoute,
					IRoutesMap, IBoom, ILoggers } from './interfaces';

// Export Interfaces.
// export * from './interfaces';

// // Export Classes
// export * from './controller';
// export * from './model';

let defaults: IConfig = {
	cwd: process.cwd(),
	pkg: require(join(process.cwd(), 'package.json')),
	host: '127.0.0.1',
	port: 3000,
	env: 'development'
};

// let routes = this.routes.filter((r: IRoute) => {
// 	return r.router === router;
// });

/**
 * RecRent
 *
 * @class RecRent
 */
export class Facile extends events.EventEmitter {

	Boom: IBoom;
	loggers: ILoggers;
	flags: any;

	config: IConfig;
	app: express.Express;
	server: Server;

	routers: IRouters;
	routes: Array<IRoute>;

	/**
	 * Creates an instance of RecRent.
	 *
	 * @memberOf RecRent
	 */
	constructor () {

		// Extend class with emitter.
		super();

		// Parse flags.
		this.flags = parseFlags();

		// Expose common Boom events to framework.
		this.Boom = {
			wrap: Boom.wrap,
			create: Boom.create,
			badRequest: Boom.badRequest,
			unauthorized: Boom.unauthorized,
			forbidden: Boom.forbidden,
			notFound: Boom.notFound,
			notImplemented: Boom.notImplemented,
			badGateway: Boom.badGateway
		};

		// Create Express app.
		this.app = express();

		console.log('Facile initialized.');


		return this;

	}

	configure(config?: IConfig): Facile {

		// Extend options with defaults.
		// Pass flags as last arg to allow
		// overwriting from command line.
		this.config = extend({}, defaults, config, this.flags);

		// Ensure environment.
		this.config.env = this.config.env || 'development';

		// Set Node environment.
		process.env.NODE_ENV = this.config.env;

		// Setup the Logger.
		let logger: LoggerInstance | ILoggers;

		// Ensure we have a logger if
		// not then create default logger.
		logger = this.config.logger ||
			{ 'default': new Logger({
					level: 'debug',
					transports: [
						new (transports.Console)(),
						new (transports.File)({
							filename: 'logs/recrent.log',
							handleExceptions: true,
							humanReadableUnhandledException: true
						})
					]
				})};

		// Create a temp logger variable to
		// test if is LoggerInstance.
		let tmpLogger = logger as LoggerInstance;

		// If is loggerInstance define
		// as default logger.
		if (tmpLogger.level)
			this.loggers = { 'default': logger } as ILoggers;
		// Otherwise we have ILoggers
		else
			this.loggers = logger as ILoggers;

		return this;

	}

	/**
	 * Adds/Creates a Router.
	 *
	 * @param {string} name
	 * @param {express.Router} [router]
	 * @returns {express.Router}
	 *
	 * @memberOf RecRent
	 */
	addRouter(name: string, router?: express.Router): express.Router {

		// Check for default router.
		if (name === 'default')
			throw new Error('Router name cannot be "default".');

		// Check if router is supplied.
		if (!router)
			router = express.Router();

		// Add router to map.
		this.routers[name] = router;

		return router;

	}

	/**
	 * Adds a route to the map.
	 *
	 * @param {(string | IRoute)} method
	 * @param {string} url
	 * @param {(express.Handler | Array<express.Handler>)} handlers
	 * @param {string} [router]
	 * @returns {RecRent}
	 *
	 * @memberOf RecRent
	 */
	addRoute(method: string | IRoute | Array<string>, url?: string,
					handlers?: express.Handler | Array<express.Handler>,
					router?: string): Facile {

		let route: IRoute;

		// Check if method is IRoute object.
		// MUST use "as" to tell typescript
		// to use that type.
		if (isPlainObject(method)) {
			route = method as IRoute;
		}

		// Otherwise define the route.
		else {

			let _method;

			if (Array.isArray(method))
				_method = method as string[];
			else
				_method = method as string;

			route = {
				router: router || 'default',
				method: _method,
				url: url,
				handlers: handlers
			};

		}

		// Add the Route.
		this.routes.push(route);

		return this;

	}

	/**
	 * Adds an array of IRoutes.
	 *
	 * @param {Array<IRoute>} routes
	 *
	 * @memberOf Framework
	 */
	addRoutes(routes: Array<IRoute> ) {
		routes.forEach((r: IRoute) => {
			this.addRoute(r);
		});
	}

	addRoutesMap(router: string | IRoutesMap, routes?: IRoutesMap) {

	}

	/**
	 * Start Server.
	 *
	 * @param {Function} [fn]
	 *
	 * @memberOf RecRent
	 */
	start(fn?: Function): Facile {

		// Ensure Routers exist.
		this.routers = this.routers || {};

		// Check for default router.
		if (!this.routers['default'])
			this.routers['default'] = this.app._router;

	  // call build.

		// Create Https if Certificate.
		if (this.config.certificate)
			this.server = createServerHttps(this.config.certificate, this.app);

		// Create Http Server.
		else
			this.server = createServer(this.app);

		// Listen for connections.
		this.server.listen(this.config.port, this.config.host);

		this.server.on('listening', fn);

		return this;

	}

	/**
	 * Stops the server.
	 *
	 * @param {string} [msg]
	 * @param {number} [code]
	 * @returns {void}
	 *
	 * @memberOf Framework
	 */
	stop(msg?: string, code?: number): void {

		if (!this.server) {
			return;
		}

	}

}

