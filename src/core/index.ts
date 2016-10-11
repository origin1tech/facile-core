
// External Dependencies.
import * as vscode from 'vscode';
import { resolve, join } from 'path';
import * as express from 'express';
import * as Boom from 'boom';
import { LoggerInstance, Logger, transports, TransportInstance } from 'winston';
import { wrap, create, badRequest, unauthorized, forbidden, notFound, notImplemented } from 'boom';
import { Server, Socket } from 'net';
import { readFileSync } from 'fs';
import { extend as _extend, isPlainObject, each, isFunction, isString, maxBy, has, isBoolean } from 'lodash';
import { red, cyan } from 'chalk';

// Internal Dependencies.
import * as utils from './utils';
import { Core } from './core';
import * as defaults from './defaults';
import { IFacile, ICertificate, IConfig, IRouters, IRoute, IBoom, ICallbackResult, IFilter,
				IMiddleware, IMiddlewares, ISockets, IModels, IControllers, IModel, IController,
				IUtils, IFilters, IConfigs, IRequestHandler, IRoutesMap, IService, IServices,
				IViewConfig, IInit, ICallback } from '../interfaces';

import * as server from './server';
import * as services from './services';
import * as filters from './filters';
import * as models from './models';
import * as controllers from './controllers';
import * as routes from './routes';

// Get Facile and App packages.
let packages = defaults.packages;

/**
 * Facile Core
 *
 * @export
 * @class Facile
 * @extends {Events}
 * @implements {IFacile}
 */
export class Facile extends Core implements IFacile {

	/**
	 * Singleton instance of Facile
	 *
	 * @static
	 * @member {Facile} Facile.staticProperty
	 * @memberOf Facile
	 */
	static instance: Facile;

	_routers: IRouters = {};
	_routes: Array<IRoute>;

	_nextSocketId: number = 0;
	_sockets: ISockets = {};

	_services: IServices = {};
	_middlewares: IMiddlewares = {};
	_filters: IFilters = {};
	_models: IModels = {};
	_controllers: IControllers = {};

	/**
	 * Facile constructor.
	 * @constructor
	 * @memberof Facile
	 */
	constructor () {

		// Extend class with emitter.
		super();

		if (Facile.instance)
			return Facile.instance;

		// Set Facile's package.json to variable.
		this._pkg = packages.pkg;

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
		this.express = express;
		this.app = express();

		// Set the instance.
		Facile.instance = this;

		return this;

	}

	///////////////////////////////////////////////////
	// CONFIGURE & MANAGE SERVER
	///////////////////////////////////////////////////

  /**
   * Configure
	 *
   * @method configure
   * @param {(string | IConfig)} [config]
   * @returns {Facile}
   * @memberOf Facile
   */
	configure(config?: string | IConfig): Facile {

		// Check if configuration is string.
		// If yes try to load the config.
		if (isString(config))
			config = this.config(config);

		// Extend options with defaults.
		this._config = _extend({}, defaults.config, config);

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

		// Ensure config auto has value.
		this._config.auto = this._config.auto !== false ? true : false;

		// If auto enable event listeners.
		if (this._config.auto) {
			this.enableEvents();
			this.execAfter('core:configure', () => {
				this.emit('init');
			});
		}
		else
			return this;

	}

	/**
	 * Returns Initialization Methods
	 *
	 * @method init
	 * @returns {IInit}
	 * @memberOf Facile
	 */
	init(): IInit {

		let self = this;

		// Ensure configuration.
		if (!this._config) {
			this.logger.warn('Failed to initialize please run facile.configure() first...exiting.');
			process.exit();
		}

		/**
		 * Used internally to trigger
		 * init events after configuration.
		 *
		 * @private
		 * @method run
		 * @returns {IInit}
		 * @memberOf Facile
		 */
		function run(): IInit {
			if (self._config.auto)
				self.execBefore('init', () => {
					self.emit('init:server');
				});
			else
				return inits;
		}

		/**
		 * Used internally to trigger
		 * init done event.
		 *
		 * @member done
		 * @private
		 * @returns {IFacile}
		 * @memberOf Facile
		 */
		function done(): IFacile {
			if (self._config.auto)
				self.execAfter('init', () => {
					self.emit('core:start');
				});
			else
				return self;
		}

		/**
		 * Used internally to trigger
		 * all initialization events.
		 *
		 * @private
		 * @member all
		 * @returns {IFacile}
		 * @memberOf Facile
		 */
		function all(): IFacile {
			return done();
		}

		let inits: IInit = {

			run: 					run.bind(this),
			server: 			server.init.bind(this),
			services: 		services.init.bind(this),
			filters: 			filters.init.bind(this),
			models: 			models.init.bind(this),
			controllers: 	controllers.init.bind(this),
			routes: 			routes.init.bind(this),
			all: 					all.bind(this),
			done: 				done.bind(this)

		};

		return run();

	}

	/**
	 * Enables Lifecycle Listeners.
	 *
	 * Events
	 *
	 * core:configure
	 * init
	 * init:server
	 * init:services
	 * init:filters
	 * init:models
	 * init:controllers
	 * init:routes
	 * init:done
	 * core:start
	 *
	 * @method enableHooks
	 * @returns {Facile}
	 * @memberOf Facile
	 */
	enableEvents(): Facile {

		let init = this.init();

		this.on('init', init.run);

		this.on('init:server', init.server);

		this.on('init:services', init.services);

		this.on('init:filters', init.filters);

		this.on('init:models', init.models);

		this.on('init:controllers', init.controllers);

		this.on('init:routes', init.routes);

		this.on('core:start', this.start);

		this.on('core:listen', this.listen);

		// Set flag indicating that
		// init hooks are listening
		// in case called manually.
		this._config.auto = true;

		return this;

	}

	/**
	 * Start Listening for Connections
	 *
	 * @method
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	listen(): Facile {

		// Listen for connections.
		this.logger.debug('Server preparing to listen.');

		this.server.listen(this._config.port, this._config.host, (err: Error) => {
			if (err)
				throw err;
		});

		return this;

	}

	/**
	 * Start Server.
	 *
	 * @method
	 * @param {Function} [fn]
	 * @method
	 * @memberof Facile
	 */
	start(config?: string | IConfig | Function, fn?: Function): Facile {

		let that: Facile = this;

		// Allow callback as first argument.
		if (isFunction(config)) {
			fn = config;
			config = undefined;
		}

		// Can't start without a config.
		if (!this._config) {

			// If no _config and no config throw error.
			if (!config)
				throw new Error('Attempted to start but not configured or no config was supplied.');

			let _config: IConfig = config;

			// If Auto return the config as
			// auto events listeners will fire
			// start.
			if (_config.auto !== false)
				return this.configure(config);

			// Otherwise just configure.
			this.configure(config);

		}

		function handleStart(): Facile {

			that.logger.debug('Starting server preparing for connections.');

			// On listening Handle Callback.
			that.server.on('listening', () => {

				let address = that.server.address(),
						addy = address.address,
						port = address.port;

				console.log(cyan('\nServer listening at: http://' + addy + ':' + port));

				// Call if callack function provided.
				if (fn) {
					that.logger.debug('Exec callback on server start/listening.');
					fn(that);
				}

				if (that._config.auto)
					that.execAfter('core:listen');

			});

			if (that._config.auto)
				that.execAfter('core:start', () => {
					that.listen();
				});
			else
				return that.listen();

		}

		if (this._config.auto)
			this.execBefore('core:start', () => {
				handleStart();
			});
		else
			return handleStart();

	}

	/**
	 * Stops the server.
	 *
	 * @method
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
	 * @method
	 * @param {string} name
	 * @param {IConfig} config
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addConfig(name: string | IConfigs, config: IConfig): Facile {
		utils.extendMap(name, config, this._configs);
		return this;
	}

	/**
	 * Adds/Creates a Router.
	 *
	 * @method
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
	 * @method
	 * @param {string} name
	 * @param {IRequestHandler} fn
	 * @param {number} [order]
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addMiddleware(name: string | IMiddlewares, fn?: any, order?: number): Facile {

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
				let max = utils.maxIn(this._middlewares, 'order') || 0;
				v.order = max;
				if (max > 0)
					v.order += 1;
			}
			// Use specified order
			// check if exists, if true
			// update with decimal until
			// value doesn't exist.
			else {
				let tmpOrder = v.order;
				// Prevents two middlewares with
				// same order value.
				while (utils.hasIn(this._middlewares, 'order', tmpOrder)) {
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
	 * @method
	 * @param {(IService | Array<IService>)} Service
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addService(Service: IService | Array<IService>): Facile {
		utils.extendMap(Service, this._services);
		return this;
	}

	/**
	 * Registers Filter or Map of Filters.
	 *
	 * @method
	 * @param {(string | IFilters)} name
	 * @param {IRequestHandler} fn
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addFilter(Filter: IFilter | Array<IFilter>): Facile {
		utils.extendMap(Filter, this._filters);
		return this;
	}

	/**
	 * Registers a Model.
	 *
	 * @method
	 * @param {(IModel | Array<IModel>)} Model
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addModel(Model: IModel | Array<IModel>): Facile {
		utils.extendMap(Model, this._models);
		return this;
	}

	/**
	 * Registers a Controller.
	 *
	 * @method
	 * @param {(IController | Array<IController>)} Controller
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	addController(Controller: IController | Array<IController>): Facile {
		utils.extendMap(Controller, this._controllers);
		return this;
	}

	/**
	 * Adds a route to the map.
	 *
	 * @method
	 * @param {(string | IRoute)} method
	 * @param {string} url
	 * @param {(express.Handler | Array<express.Handler>)} handlers
	 * @param {string} [router]
	 * @returns {RecRent}
	 *
	 * @memberOf Facile
	 */
	addRoute(route: IRoute | IRoutesMap | IRoute[]): Facile {

		let self = this;

		// Helper function to validate
		// the route and log if invalid.
		function validate(_route: IRoute) {

			// Validate the route.
			_route = utils.validateRoute(route);

			// Push the route to the collection
			// if is valid.
			if (_route.valid)
				self._routes.push(_route);

			// Otherwise log a warning.
			else
				self.logger.warn(`Failed to add route "${_route.url}", the configuration is invalid.`, route);

		}

		// Handle array of route objects.
		if (Array.isArray(route)) {
			let routes = route as Array<IRoute>;
			routes.forEach((r) => {
				validate(r);
			});
		}

		// Handle Routes map.
		else if (isPlainObject(route)) {
			let routes = route as IRoutesMap;
			each(routes, (v, k) => {
				let r = utils.parseRoute(k, v);
				validate(r);
			});
		}

		else {
			validate(route);
		}

		return this;

	}

	///////////////////////////////////////////////////
	// INSTANCE HELPERS
	///////////////////////////////////////////////////

	/**
	 * Gets a Router by name.
	 *
	 * @method
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
	 * @method
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
	 * @method
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
	 * @method
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
	 * @method
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
	 * @method
	 * @param {string} name
	 * @returns {IController}
	 *
	 * @memberOf Facile
	 */
	controller(name: string): IController {
		return this._controllers[name];
	}

	/**
	 * Wrapper for utils extend.
	 *
	 * @param {...any[]} args
	 * @returns {*}
	 *
	 * @memberOf Facile
	 */
	extend(...args: any[]): any {
		return _extend.apply(null, args);
	}

}
