
// Import Dependencies.
import * as events from 'events';
import { resolve, join } from 'path';
import * as express from 'express';
import * as Boom from 'boom';
import { LoggerInstance, Logger, transports} from 'winston';
import { wrap, create, badRequest, unauthorized, forbidden, notFound, notImplemented } from 'boom';
import { createServer } from 'http';
import { createServer as createServerHttps } from 'https';
import { Server, Socket } from 'net';
import { readFileSync } from 'fs';
import { extend, isPlainObject, each, isFunction, isString, maxBy } from 'lodash';
import { parseFlags, noop } from './utils';
import { red, cyan } from 'chalk';


// Import Interfaces.
import { IFacile, ICertificate, IConfig, IRouters, IRoute,
				 IRoutesMap, IBoom, ILoggers, ICallback,
				 IMiddleware, IMiddlewares, ISockets, IModels,
				 IControllers, IModel, IController, IFilter, IFilters} from './interfaces';

// Export Interfaces.
// export * from './interfaces';

// // Export Classes
// export * from './controller';
// export * from './model';

let defaults: IConfig = {
	cwd: process.cwd(),
	pkg: require(join(process.cwd(), 'package.json')),
	env: 'development',
	logLevel: 'info',
	host: '127.0.0.1',
	port: 3000,
	maxConnections: 128
};

/**
 * RecRent
 *
 * @class RecRent
 */
export class Facile extends events.EventEmitter implements IFacile {

	Boom: IBoom;
	loggers: ILoggers;
	log: LoggerInstance;

	config: IConfig;
	app: express.Express;
	server: Server;

	routers: IRouters;
	routes: Array<IRoute>;

	nextSocketId: number = 0;
	sockets: ISockets;

	middlewares: IMiddlewares;
	filters: IFilters;
	models: IModels;
	controllers: IControllers;

	/**
	 * Creates an instance of RecRent.
	 *
	 * @memberOf Facile
	 */
	constructor () {

		// Extend class with emitter.
		super();

		// Create the default logger.
		let defaultLogger = new Logger({
			level: 'info',
			transports: [
				new (transports.Console)({
					prettyPrint: true,
					handleExceptions: true,
					humanReadableUnhandledException: true
				}),
				new (transports.File)({
					filename: 'logs/' + this.config.pkg.name + '.log',
					handleExceptions: true,
					humanReadableUnhandledException: true
				})
			]
		});

		// Add default logger to map 
		// and set as "log" instance.
		this.loggers['default'] = this.log = defaultLogger;

		this.log.debug('Creating Express instance.');

		// Create Express app.
		this.app = express();

		return this;

	}

	///////////////////////////////////////////////////
	// CONFIGURE & MANAGE SERVER
	///////////////////////////////////////////////////

	configure(config?: IConfig): Facile {

		// Extend options with defaults.
		this.config = extend({}, defaults, config);

		// Setup the Logger.
		let logger: LoggerInstance | ILoggers;

		// Ensure we have a logger if
		// not then create default logger.
		logger = this.config.logger || { 'default': this.log };

		// Create a temp logger variable to
		// test if is LoggerInstance.
		let tmpLogger = logger as LoggerInstance;

		// If is loggerInstance define
		// as default logger.
		if ((tmpLogger instanceof Logger))
			this.loggers = { 'default': tmpLogger } as ILoggers;

		// Otherwise we have ILoggers
		else
			this.loggers = logger as ILoggers;

		// Set log to default logger.
		this.log = this.loggers['default'];

		this.log.debug('Defining Boom error handlers.');

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

		this.log.debug('Defining node environment.');

		// Ensure environment.
		this.config.env = this.config.env || 'development';

		// Set Node environment.
		process.env.NODE_ENV = this.config.env;

		return this;

	}

	/**
	 * Starts server listening for connections.
	 *
	 *
	 * @memberOf Facile
	 */
	listen(): void {
		this.server.listen(this.config.port, this.config.host, (err: Error) => {
			if (err)
				throw err;
		});
	}

	/**
	 * Start Server.
	 *
	 * @param {Function} [fn]
	 *
	 * @memberOf Facile
	 */
	start(fn?: Function): Facile {

		// Ensure Routers exist.
		this.routers = this.routers || {};

		// Check for default router.
		if (!this.routers['default'])
			this.routers['default'] = this.app._router;

		// Create Https if Certificate.
		if (this.config.certificate)
			this.server = createServerHttps(this.config.certificate, this.app);

		// Create Http Server.
		else
			this.server = createServer(this.app);

		// Limit server connections.
		this.server.maxConnections = this.config.maxConnections;

		// Listener callback on server listening.
		this.server.on('listening', () => {

			let address = this.server.address(),
					addy = address.address,
					port = address.port;

			console.log(cyan('\nServer listening at: http://' + addy + ':' + port));

			// Call if callack function provided.
			if (fn)
				fn(this);

		});

		// Store connections
		this.server.on('connection', (socket: Socket) => {

			// Save the connection.
			let socketId = this.nextSocketId++;
			this.sockets[socketId] = socket;

			// Listen for socket close.
			socket.on('close', () => {
				this.log.debug('Socket ' + socketId + ' was closed.');
				delete this.sockets[socketId];
			});

		});

		// If build function call before
		// server listen.
		if (this.config.build)
			this.config.build(this, (err?: string | Error) => {

				// If error don't start server.
				if (err !== undefined) {
					if (typeof err === 'string')
						err = new Error(err);
					throw err;
				}

				// All clear fire up server.
				this.listen();

			});

		// Otherwise just start server and listen.
		else
			this.listen();

		return this;

	}

	/**
	 * Stops the server.
	 *
	 * @param {string} [msg]
	 * @param {number} [code]
	 * @returns {void}
	 *
	 * @memberOf Facile
	 */
	stop(msg?: string, code?: number): void {

		if (!this.server) {
			return;
		}

		// Closing sockets.
		let socketKeys = Object.keys(this.sockets);
		this.log.debug('Closing active (' + socketKeys.length + ') socket connections.');

		socketKeys.forEach((id) => {
			let socket = this.sockets[id];
			if (socket)
				socket.destroy();
		});

		// Close the server.
		this.log.debug('Closing server.');
		this.server.close(() => {
			console.log(cyan('\nServer successfully closed.'));
		});

	}

	///////////////////////////////////////////////////
	// REGISTERING RESOURCES
	///////////////////////////////////////////////////

	/**
	 * Adds/Creates a Router.
	 *
	 * @param {string} name
	 * @param {express.Router} [router]
	 * @returns {express.Router}
	 *
	 * @memberOf Facile
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
	 * Registers middleware with Express.
	 *
	 * @param {string} name
	 * @param {Function} fn
	 * @param {number} [order]
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addMiddleware(name: string, fn: Function, order?: number): Facile {

		// Get max orer id.
		let max = maxBy(this.middlewares, 'order').order;

		// The orderId is essentially
		// the sort order.
		let orderId = order !== undefined ? order: (max += 1);

		if (this.middlewares[orderId]) {

		}

		// Define the middleware.
		let middleware: IMiddleware = {
			fn: fn,
			order: order
		};

		return this;

	}

	/**
	 * Registers a filter.
	 *
	 * @param {string} name
	 * @param {Function} fn
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addFilter(name: string, fn: Function): Facile {
		return this;
	}

	/**
	 * Adds Model to map.
	 *
	 * @param {string} name
	 * @param {IModel} model
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addModel(name: string, model: IModel): Facile {
		this.models[name] = model;
		return this;
	}

	/**
	 * Adds Controller to map.
	 *
	 * @param {string} name
	 * @param {IController} controller
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addController(name: string, controller: IController): Facile {
		this.controllers[name] = controller;
		return this;
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
	 * @memberOf Facile
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
	 * @memberOf Facile
	 */
	addRoutes(routes: Array<IRoute>): Facile {
		routes.forEach((r: IRoute) => {
			this.addRoute(r);
		});
		return this;
	}

	/**
	 * Adds routes using route map.
	 *
	 * @param {(string | IRoutesMap)} router
	 * @param {IRoutesMap} [routes]
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addRoutesMap(router: string | IRoutesMap, routes?: IRoutesMap): Facile {
		return this;
	}

	///////////////////////////////////////////////////
	// INSTANCE HELPERS
	///////////////////////////////////////////////////

	/**
	 * Returns a Logger my name.
	 *
	 * @param {string} name
	 * @returns {LoggerInstance}
	 *
	 * @memberOf Facile
	 */
	logger(name: string): LoggerInstance {
		return this.loggers[name];
	}

	/**
	 * Gets a Filter by name.
	 *
	 * @param {string} name
	 * @returns {IFilter}
	 *
	 * @memberOf Facile
	 */
	filter(name: string): IFilter {
		return this.filters[name];
	}

	/**
	 * Gets a Model by name.
	 *
	 * @param {string} name
	 * @returns {IModel}
	 *
	 * @memberOf Facile
	 */
	model(name: string): IModel {
		return this.models[name];
	}

	/**
	 * Gets a controller by name.
	 *
	 * @param {string} name
	 * @returns {IController}
	 *
	 * @memberOf Facile
	 */
	controller(name: string): IController {
		return this.controllers[name];
	}

}

