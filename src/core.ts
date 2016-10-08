
// External Dependencies.
import * as vscode from 'vscode';
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
import { extend, isPlainObject, each, isFunction, isString, maxBy, has } from 'lodash';
import { red, cyan } from 'chalk';

// Internal Dependencies.
import * as utils from './utils';
import { parse } from './commands';
import { IFacile, ICertificate, IConfig, IRouters, IRoute, IBoom, ICallback,
				IMiddleware, IMiddlewares, ISockets, IModels, IControllers, IModel, IController,
				IUtils, IFilters, IConfigs, IRequestHandler, IRoutesMap } from './interfaces';

// Get Facile and App packages.
let pkg = require('../package.json');
let appPkg = require(join(process.cwd(), 'package.json'));

// Default config values.
let defaults: IConfig = {
	cwd: process.cwd(),
	pkg: appPkg,
	env: 'development',
	logLevel: 'info', // only sets default logger's level.
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

	static instance: Facile;

	Boom: IBoom;
	utils: IUtils;
	app: express.Express;
	server: Server;
	logger: LoggerInstance;

	_pkg: any;
	_config: IConfig;
	_configs: IConfigs = {};

	_routers: IRouters = {};
	_routes: Array<IRoute>;

	_nextSocketId: number = 0;
	_sockets: ISockets;

	_middlewares: IMiddlewares = {};
	_filters: IFilters = {};
	_models: IModels = {};
	_controllers: IControllers = {};

	/**
	 * Creates an instance of RecRent.
	 *
	 * @memberOf Facile
	 */
	constructor () {

		// Extend class with emitter.
		super();

		if (Facile.instance)
			return Facile.instance;

		// Set Facile's package.json to variable.
		this._pkg = pkg;

		// Expose Facile utils.
		this.utils = utils;

		// Create the default logger.
		// This will likely be overwritten.
		let defaultLogger = new Logger({
			level: 'info',
			transports: [
				new (transports.Console)({
					prettyPrint: true,
					handleExceptions: true,
					humanReadableUnhandledException: true
				})
			]
		});

		// Add default logger to map 
		// and set as "log" instance.
		this.logger = defaultLogger;

		// Create Express app.
		this.app = express();

		// Set the instance.
		Facile.instance = this;

		return this;

	}

	///////////////////////////////////////////////////
	// CONFIGURE & MANAGE SERVER
	///////////////////////////////////////////////////

	/**
	 * Applies Configuration.
	 *
	 * @param {(string | IConfig)} [config]
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	configure(config?: string | IConfig): Facile {

		// Check if configuration is string.
		// If yes try to load the config.
		if (isString(config))
			config = this.config(config);

		// Extend options with defaults.
		this._config = extend({}, defaults, config);

		// Setup the Logger.
		if (this._config.logger)
			this.logger = this._config.logger;

		this.logger.debug('Defining Boom error handlers.');

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

		this.logger.debug('Defining node environment.');

		// Ensure environment.
		this._config.env = this._config.env || 'development';

		// Set Node environment.
		process.env.NODE_ENV = this._config.env;

		// Emit Configured.
		this.emit('core:configured', this);

		return this;

	}

	/**
	 * Starts server listening for connections.
	 *
	 *
	 * @memberOf Facile
	 */
	listen(): void {
		this.server.listen(this._config.port, this._config.host, (err: Error) => {
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

		let self = this;

		// Ensure Routers exist.
		this._routers = this._routers || {};

		// Check for default router.
		if (!this._routers['default'])
			this._routers['default'] = this.app._router;

		// Create Https if Certificate.
		if (this._config.certificate)
			this.server = createServerHttps(this._config.certificate, this.app);

		// Create Http Server.
		else
			this.server = createServer(this.app);

		// Limit server connections.
		this.server.maxConnections = this._config.maxConnections;

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
			let socketId = this._nextSocketId++;
			this._sockets[socketId] = socket;

			// Listen for socket close.
			socket.on('close', () => {
				this.logger.debug('Socket ' + socketId + ' was closed.');
				delete this._sockets[socketId];
			});

		});

		// If build function call before
		// server listen.
		if (this._config.build)
			this._config.build(self, (err?: string | Error) => {

				// If error don't start server.
				if (err !== undefined) {
					if (isString(err))
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
		let socketKeys = Object.keys(this._sockets);
		this.logger.debug('Closing active (' + socketKeys.length + ') socket connections.');

		socketKeys.forEach((id) => {
			let socket = this._sockets[id];
			if (socket)
				socket.destroy();
		});

		// Close the server.
		this.logger.debug('Closing server.');
		this.server.close(() => {
			console.log(cyan('\nServer successfully closed.'));
		});

	}

	///////////////////////////////////////////////////
	// REGISTERING RESOURCES
	///////////////////////////////////////////////////

	/**
	 * Adds a Configuration.
	 *
	 * @param {string} name
	 * @param {IConfig} config
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addConfig(name: string | IConfigs, config: IConfig): Facile {
		this.utils.addType(name, config, this._configs);
		return this;
	}

	/**
	 * Adds/Creates a Router.
	 *
	 * @param {string} name
	 * @param {express.Router} [router]
	 * @returns {express.Router}
	 *
	 * @memberOf Facile
	 */
	addRouter(name: string | IRouters, router?: express.Router): express.Router {

		// If object check if "default" was passed.
		let hasDefault = isPlainObject(name) && has(name, 'default');

		// Check for default router.
		if (name === 'default' || hasDefault)
			throw new Error('Router name cannot be "default".');

		// Add router to map.
		if (isString(name))
			this._routers[name] = router || express.Router();
		else
			Object.keys(name).forEach((k) => {
				this._routers[k] = name[k] || express.Router();
			});

		return router;

	}

	/**
	 * Registers Middleware or Middlewares to Express.
	 *
	 * @param {string} name
	 * @param {IRequestHandler} fn
	 * @param {number} [order]
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addMiddleware(name: string | IMiddlewares, fn: IRequestHandler, order?: number): Facile {

		let middlewares: IMiddlewares = {};

		// Adding single middleware.
		if (isString(name))
			middlewares[name] = {
				fn: fn,
				order: order
			};

		// Adding map of middleware.
		else
			middlewares = name;

		// Iterate the map ensure order.
		each(middlewares, (v, k) => {

			// No order generate.
			if (v.order === undefined) {
					v.order = this.utils.maxIn(this._middlewares, 'order') + 1;
			}
			// Use specified order
			// check if exists, if true
			// update with decimal until
			// value doesn't exist.
			else {
				let tmpOrder = v.order;
				// Prevents two middlewares with
				// same order value.
				while (this.utils.hasIn(this._middlewares, 'order', tmpOrder)) {
					tmpOrder += .1;
				}
				v.order = tmpOrder;
			}

			// Update the middlewares object.
			this._middlewares[k] = v;

		});

		return this;

	}

	/**
	 * Registers Filter or Map of Filters.
	 *
	 * @param {(string | IFilters)} name
	 * @param {IRequestHandler} fn
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addFilter(name: string | IFilters, fn: IRequestHandler): Facile {
		this.utils.addType(name, fn, this._filters);
		return this;
	}

	/**
	 * Adds Model
	 *
	 * @param {(string | IModels)} name
	 * @param {IModel} model
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addModel(name: string | IModels, model: IModel): Facile {
		this.utils.addType(name, model, this._models);
		return this;
	}

	/**
	 * Adds Controller
	 *
	 * @param {(string | IControllers)} name
	 * @param {IController} controller
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addController(name: string | IControllers, controller: IController): Facile {
		this.utils.addType(name, controller, this._controllers);
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
	addRoute(method: string | IRoute | Array<string> | IRoutesMap, url?: string,
					handlers?: IRequestHandler | Array<IRequestHandler>, router?: string): Facile {

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
		this._routes.push(route);

		return this;

	}

	///////////////////////////////////////////////////
	// INSTANCE HELPERS
	///////////////////////////////////////////////////

	/**
	 * Gets a Router by name.
	 *
	 * @param {string} name
	 * @returns {express.Router}
	 *
	 * @memberOf Facile
	 */
	router(name: string): express.Router {
		return this._routers[name];
	}

	/**
	 * Gets a Config by name.
	 *
	 * @param {string} name
	 * @returns {IConfig}
	 *
	 * @memberOf Facile
	 */
	config(name: string): IConfig {
		return this._configs[name];
	}

	/**
	 * Gets a Filter by name.
	 *
	 * @param {string} name
	 * @returns {IFilter}
	 *
	 * @memberOf Facile
	 */
	filter(name: string): IRequestHandler {
		return this._filters[name];
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
		return this._models[name];
	}

	/**
	 * Gets a Controller by name.
	 *
	 * @param {string} name
	 * @returns {IController}
	 *
	 * @memberOf Facile
	 */
	controller(name: string): IController {
		return this._controllers[name];
	}

}

