
// External Dependencies.
import * as vscode from 'vscode';
import { resolve, join } from 'path';
import * as express from 'express';
import * as Boom from 'boom';
import { series as asyncSeries } from 'async';
import { LoggerInstance, Logger, transports, TransportInstance } from 'winston';
import { wrap, create, badRequest, unauthorized, forbidden, notFound, notImplemented } from 'boom';
import { Server, Socket } from 'net';
import { readFileSync } from 'fs';
import { extend as _extend, isPlainObject, each, isFunction,
				isString, maxBy, has, isBoolean, bind } from 'lodash';
import { red, cyan } from 'chalk';

// Internal Dependencies.
import * as utils from './utils';
import { Core } from './core';
import * as defaults from './defaults';
import { IFacile, ICertificate, IConfig, IRouters, IRoute, IBoom, ICallbackResult, IFilter,
				IMiddleware, ISockets, IModel, IController,
				IUtils, IConfigs, IRequestHandler, IRoutesMap, IService,
				IViewConfig, IInit, ICallback } from '../interfaces';
import { Collection } from './collection';

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
					colorize: true,
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
		this._initialized = false;
		this._started = false;

		// Set the instance.
		Facile.instance = this;

		return this;

	}

	///////////////////////////////////////////////////
	// PRIVATE METHODS
	///////////////////////////////////////////////////

	/**
	 * Enables Lifecycle Listeners.
	 *
	 * Events
	 *
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
	private enableListeners(): Facile {

		let init = this.init();

		this.on('init', init.run);

		this.on('init:server', init.server);

		this.on('init:services', init.services);

		this.on('init:filters', init.filters);

		this.on('init:models', init.models);

		this.on('init:controllers', init.controllers);

		this.on('init:routes', init.routes);

		this.on('init:done', init.done);

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
	private listen(): void {

		if (!this._started) {
			this.logger.error('Facile.listen() cannot be called directly please use .start().');
			process.exit();
		}

		// Listen for connections.
		this.logger.debug('Server preparing to listen.');

		this.server.listen(this._config.port, this._config.host, (err: Error) => {
			if (err)
				throw err;
		});

	}

	/**
	 * Generic method for add controllers,
	 * models, filters and services.
	 *
	 * @param {*} name
	 * @param {*} Type
	 * @param {*} map
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	private addComponent<T>(name: any, Type: any, collection?: Collection<T>): Facile {

		// Adding single component by name and class/function.
		if (isString(name)) {
			collection.add(name, Type);
		}

		// Otherwise iterate object.
		else if (isPlainObject(name)) {
			each(name, (v, k) => {
				collection.add(k, v);
			});
		}

		// Otherwise log error.
		else {
			this.logger.error('Failed ot add component expected type ' +
												'string or object but got "' + typeof name + ' ".');
		}

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

		this._configured = true;

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

		let facile: Facile = this;

		// Ensure configuration.
		if (!this._config) {
			this.logger.warn('Failed to initialize please run facile.configure()...exiting.');
			process.exit();
		}

		if (this._config.auto && !this._autoInit) {
			console.log('');
			this.logger.error('Facile config set to "auto" but attempted to init manually.');
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
		function run(): void {

			if (!facile._config.auto) {
				this.logger.error('The method init().run() cannot be called manually use { auto: true } in your configuration.');
				process.exit();
			}

			facile.execBefore('init', () => {
				facile.emit('init:server');
			});

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
		function done(): Facile {

			facile.logger.debug('Facile initialization complete.');

			facile._initialized = true;

			if (facile._config.auto) {

				facile.execAfter('init', () => {
					facile.emit('core:start');
				});

			}

			else {

				return facile;

			}

		}

		let inits: IInit = {

			// run: 					run.bind(that),
			// server: 				server.init.bind(that),
			// services: 			services.init.bind(that),
			// filters: 			filters.init.bind(that),
			// models: 				models.init.bind(that),
			// controllers: 	controllers.init.bind(that),
			// routes: 				routes.init.bind(that),
			// done: 					done.bind(that)

			run: 						run,
			server: 				server.init(facile),
			services: 			services.init(facile),
			filters: 				filters.init(facile),
			models: 				models.init(facile),
			controllers: 		controllers.init(facile),
			routes: 				routes.init(facile),
			done: 					done

		};

		return inits;

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

		// Allow callback as first argument.
		if (isFunction(config)) {
			fn = config;
			config = undefined;
		}

		/////////////////////////////
		// Wait/Start Facile
		/////////////////////////////

		function handleStart(): void {

			// On listening Handle Callback.
			this.server.on('listening', () => {

				let address = this.server.address(),
						addy = address.address,
						port = address.port;

				if (this._config.auto)
					this.execAfter('core:listen');

				// Call if callack function provided.
				if (fn)
					fn(this);

				console.log(cyan('\nServer listening at: http://' + addy + ':' + port));

			});

			if (this._config.auto) {
				this.execAfter('core:start', () => {
					this._started = true;
					this.emit('core:listen');
				});
			}
			else {
				this._started = true;
				this.listen();
			}

		}

		let waitId;

		/**
		 * Waits to start server until initialized.
		 * This is only used when "auto" is NOT set
		 * to true in your config.
		 */
		function handleWaitStart(): void {
			if (!this._initialized) {
				waitId = setTimeout(handleWaitStart.bind(this), 10);
			}
			else {
				clearTimeout(waitId);
				handleStart.call(this);
			}
		}

		/////////////////////////////
		// Ensure Configuration
		/////////////////////////////

		if (!this._configured)
			this.configure(config);

		// Can't continue without configuration.
		// Should never hit but just in case.
		if (!this._config) {
			console.log('');
			this.logger.error('Failed to start Facile missing or invalid configuration.');
			process.exit();
		}

		/////////////////////////////
		// Manual or Auto Init
		/////////////////////////////

		if (this._config.auto) {

			this.logger.debug('Auto configuration detected.');

			// Initialize first which will round
			// trip and call start again falling
			// through to the execution below.
			if (!this._initialized) {

				// ensures manual init is not called while auto is set.
				this._autoInit = true;

				this.enableListeners();
				this.init().run();

			}

			// Facile now initalized can now start.
			else {

				this.execBefore('core:start', () => {
					handleStart.call(this);
				});

				return this;

			}

		}
		else {

			// When starting manually must have
			// called configure and init manually
			// before starting.
			if (!this._initialized) {
				console.log('');
				this.logger.error('Facile failed to start call facile.init() before starting.');
				process.exit();
			}

			handleWaitStart.call(this);

			// Don't wait just return.
			return this;

		}

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
		if (name === 'default' || hasDefault) {
			this.logger.warn('Default router is readonly previously defined router.');
			return this.router('default');
		}

		// Add router to map.
		if (isString(name))
			this._routers[name] = router || express.Router();

		// Add multiple
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
	addService(name: string | IService, Service?: IService): Facile {
		let collection: Collection<any> = this._services;
		return this.addComponent(name, Service, this._services);
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
	addFilter(name: string | IFilter, Filter?: IFilter): Facile {
		return this.addComponent(name, Filter, this._filters);
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
	addModel(name: string | IModel, Model?: IModel): Facile {
		return this.addComponent(name, Model, this._models);
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
	addController(name: string | IController,
								Controller?: IController): Facile {
		return this.addComponent(name, Controller, this._controllers);
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
				let rte = utils.parseRoute(k, v);
				validate(rte);
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

	component(name: string, map: any) {
		let obj = this[map] || {};
		return obj[name];
	}

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
	 * Gets a Service
	 *
	 * @member service
	 * @template T
	 * @param {string} name
	 * @returns {T}
	 *
	 * @memberOf Facile
	 */
	service<T>(name: string): T {
		let component: T = this._services[name];
		return component;
	}

	/**
	 * Gets a Filter
	 *
	 * @member filter
	 * @template T
	 * @param {string} name
	 * @returns {T}
	 *
	 * @memberOf Facile
	 */
	filter<T>(name: string): T {
		let component: T = this._filters[name];
		return component;
	}

	/**
	 * Gets a Model
	 *
	 * @member model
	 * @template T
	 * @param {string} name
	 * @returns {T}
	 *
	 * @memberOf Facile
	 */
	model<T>(name: string): T {
			let component: T = this._models[name];
		return component;
	}

	/**
	 * Gets a Controller.
	 *
	 * @member controller
	 * @template T
	 * @param {string} name
	 * @returns {T}
	 *
	 * @memberOf Facile
	 */
	controller<T>(name: string): T {
		let component: T = this._controllers[name];
		return component;
	}

	/**
	 * Convenience wrapper for lodash extend.
	 *
	 * @member extend
	 * @param {...any[]} args
	 * @returns {*}
	 *
	 * @memberOf Facile
	 */
	extend(...args: any[]): any {
		return _extend.apply(null, args);
	}

	/**
	 * Extends configuration files.
	 *
	 * @member extendConfig
	 * @param {...any[]} configs
	 * @returns {IConfig}
	 *
	 * @memberOf Facile
	 */
	extendConfig(...configs: any[]): IConfig {

		let arr: IConfig[] = [];

		configs.forEach((c) => {
			if (isString(c))
				c = this._configs[c];
			arr.push(c);
		});

		arr.unshift({});

		return _extend.apply(null, arr);

	}

}
