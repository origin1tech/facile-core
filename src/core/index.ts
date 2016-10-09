
// External Dependencies.
import * as vscode from 'vscode';
import * as events from 'events';
import { resolve, join } from 'path';
import * as express from 'express';
import * as Boom from 'boom';
import { LoggerInstance, Logger, transports, TransportInstance } from 'winston';
import { wrap, create, badRequest, unauthorized, forbidden, notFound, notImplemented } from 'boom';
import { createServer } from 'http';
import { createServer as createServerHttps } from 'https';
import { Server, Socket } from 'net';
import { readFileSync } from 'fs';
import { extend, isPlainObject, each, isFunction, isString, maxBy, has, isBoolean } from 'lodash';
import { red, cyan } from 'chalk';
import * as cons from 'consolidate';

// Internal Dependencies.
import * as utils from './utils';
import { parse } from './commands';
import { IFacile, ICertificate, IConfig, IRouters, IRoute, IBoom, ICallback, IFilter,
				IMiddleware, IMiddlewares, ISockets, IModels, IControllers, IModel, IController,
				IUtils, IFilters, IConfigs, IRequestHandler, IRoutesMap, IService, IServices,
				IViewConfig } from '../interfaces';

// Get Facile and App packages.
let pkg = require('../../package.json');
let appPkg = require(join(process.cwd(), 'package.json'));

// Default config values.
let defaults: IConfig = {
	cwd: process.cwd(),
	pkg: appPkg,
	env: 'development',
	logLevel: 'info',
	host: '127.0.0.1',
	port: 8080,
	maxConnections: 128,
	views: {
		layout: 'index',
		engine: {
			name: 'ejs',
			renderer: cons.ejs
		},
		'view engine': 'ejs',
		views: '/'
	}
};

/**
 * Facile Core
 *
 * @export
 * @class Facile
 * @extends {events.EventEmitter}
 * @implements {IFacile}
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

	_services: IServices = {};
	_middlewares: IMiddlewares = {};
	_filters: IFilters = {};
	_models: IModels = {};
	_controllers: IControllers = {};

	/**
	 * Creates an instance of RecRent.
	 *
	 * @constructor
	 * @memberof Facile
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
	 * Configures Facile
	 * optionally provide boolean to
	 * auto load and start.
	 *
	 * @param {(IConfig | boolean)} [config]
	 * @param {(boolean | ICallback)} [autoStart]
	 * @param {ICallback} [fn]
	 * @returns {(Facile | void)}
	 *
	 * @memberOf Facile
	 */
	configure(config?: IConfig | boolean, autoStart?: boolean | ICallback,
						fn?: ICallback): Facile {

		// Check if config is boolean.
		if (isBoolean(config)) {
			fn = autoStart as ICallback;
			autoStart = config;
			config = undefined;
		}

		// Check if configuration is string.
		// If yes try to load the config.
		if (isString(config))
			config = this.config(config);

		// Extend options with defaults.
		this._config = extend({}, defaults, config);

		// Setup the Logger.
		if (this._config.logger)
			this.logger = this._config.logger;

		// If log level was set Iterate
		// transports and set level.
		if (this._config.logLevel)
			each(this.logger.transports, (t: any) => {
				t.level = this._config.logLevel;
			});

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

		// No auto start return instance.
		if (!autoStart)
			return this;

		// Load controllers, models and services.
		return this.start(fn);

	}

	/**
	 * Start Server.
	 *
	 * @param {Function} [fn]
	 * @method
	 * @memberof Facile
	 */
	start(fn?: Function): Facile {

		let self = this;

		this.logger.debug('Configuring server protocol and settings.');

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
			if (fn) {
				this.logger.debug('Exec callback on server start/listening.');
				fn(this);
			}

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

		// Listen for connections.
		this.logger.debug('Preparing server to listen for connections.');
		this.server.listen(this._config.port, this._config.host, (err: Error) => {
			if (err)
				throw err;
		});

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
		this.utils.extendMap(name, config, this._configs);
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
	 * Registers a Service.
	 *
	 * @param {(IService | Array<IService>)} Service
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addService(Service: IService | Array<IService>): Facile {
		this.utils.extendMap(Service, this._services);
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
	addFilter(Filter: IFilter | Array<IFilter>): Facile {
		this.utils.extendMap(Filter, this._filters);
		return this;
	}

	/**
	 * Registers a Model.
	 *
	 * @param {(IModel | Array<IModel>)} Model
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addModel(Model: IModel | Array<IModel>): Facile {
		this.utils.extendMap(Model, this._models);
		return this;
	}

	/**
	 * Registers a Controller.
	 *
	 * @param {(IController | Array<IController>)} Controller
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addController(Controller: IController | Array<IController>): Facile {
		this.utils.extendMap(Controller, this._controllers);
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
	addRoute(method: string | string[] | IRoutesMap | IRoute[],
					url?: string,
					handler?: IRequestHandler,
					filters?: IRequestHandler | IRequestHandler[],
					router?: string): Facile {

		let route: IRoute;

		// Handle array of route objects.
		if (Array.isArray(method)) {
			let routes = method as Array<IRoute>;
			routes.forEach((r) => {
				this._routes.push(r);
			});
		}

		// Http Method or array of Methods passed.
		else if (isString(method) || (Array.isArray(method) && isString(method[0]))) {

		}

		// Handle Routes map.
		else if (isPlainObject(method)) {
			let routes = method as IRoutesMap;

		}

		else {
			throw new Error('Invalid route configuration could not add route.');
		}

		// route = {
		// 	router: router || 'default',
		// 	method: _method,
		// 	url: url,
		// 	handler: handlers
		// };

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
	 * Gets a Service by name.
	 *
	 * @param {string} name
	 * @returns {IService}
	 *
	 * @memberOf Facile
	 */
	service(name: string): IService {
		return this._services[name];
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
