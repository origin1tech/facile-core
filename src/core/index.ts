
// External Dependencies.
import { resolve, join } from 'path';
import * as express from 'express';
import * as Boom from 'boom';
import { series as asyncSeries } from 'async';
import { LoggerInstance, Logger, transports, TransportInstance } from 'winston';
import { wrap, create, badRequest, unauthorized, forbidden, notFound, notImplemented } from 'boom';
import { Server, Socket } from 'net';
import { readFileSync } from 'fs';
import { extend, isPlainObject, each, isFunction, assign,
				isString, maxBy, has, isBoolean, bind, values, merge, sortBy } from 'lodash';
import { red, cyan } from 'chalk';

// Internal Dependencies.
import * as utils from './utils';
import { Core } from './core';
import * as defaults from './defaults';
import { IFacile, ICertificate, IConfig, IRouters, IRoute,
				IErrors, ICallbackResult, IFilter,
				IMiddleware, ISockets, IModel, IController,
				IUtils, IConfigs, IRequestHandler, IRoutes, IService,
				IViewConfig, IInit, ICallback, IMiddlewares, IComponents,
				IComponent, IErrorRequestHandler, IPolicies, IPolicy } from '../interfaces';
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

		// set the app's package.json.
		this._apppkg = packages.apppkg;

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
		this.log = defaultLogger;

		// Expose common Boom events to framework.
		this._errors = {
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
		this.express = express;
		this.app = express();
		this._initialized = false;
		this._started = false;

		// support v5.x see app.router instead of app._router.
		this._routers['default'] = this.app.router || this.app._router;

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
	 * core:listen
	 *
	 * @private
	 * @method _enableListeners
	 * @returns {Facile}
	 * @memberOf Facile
	 */
	private _enableListeners(): Facile {

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

		this.on('core:listen', this._listen);

		// Set flag indicating that
		// init hooks are listening
		// in case called manually.
		this._config.auto = true;

		return this;

	}

	/**
	 * Start Listening for Connections
	 *
	 * @private
	 * @method _listen
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	private _listen(): void {

		if (!this._started) {
			this.log.error('Facile.listen() cannot be called directly please use .start().');
			process.exit();
		}

		// Listen for connections.
		this.log.debug('Server preparing to listen.');

		this.server.listen(this._config.port, this._config.host, (err: Error) => {
			if (err)
				throw err;
		});

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
		this._config = merge({}, defaults.config, config);

		// Setup the Logger.
		if (this._config.logger)
			this.log = this._config.logger;

		// If log level was set Iterate
		// transports and set level.
		if (this._config.logLevel)
			each(this.log.transports, (t: any) => {
				t.level = this._config.logLevel;
			});

		this.log.debug('Defining node environment.');

		// Ensure environment.
		this._config.env = this._config.env || 'development';

		// Set Node environment.
		process.env.NODE_ENV = this._config.env;

		this.log.debug('Normalizing configuration options.');

		// Check if generated routes option is set to true.
		if (this._config.routes) {
			if (this._config.routes.rest === true)
				this._config.routes.rest = defaults.config.routes.rest;
			if (this._config.routes.crud === true)
				this._config.routes.crud = defaults.config.routes.crud;
		}

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
			this.log.warn('Failed to initialize please run facile.configure()...exiting.');
			process.exit();
		}

		if (this._config.auto && !this._autoInit) {
			console.log('');
			this.log.error('Facile config set to "auto" but attempted to init manually.');
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
		 * @returns {Facile}
		 * @memberOf Facile
		 */
		function done(): Facile {

			facile.log.debug('Facile initialization complete.');

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
	 * @method start
	 * @param {Function} [fn]
	 * @method
	 * @memberof Facile
	 */
	start(config?: string | IConfig | Function, fn?: Function): Facile {

		let self = this;

		// Allow callback as first argument.
		if (isFunction(config)) {
			fn = config;
			config = undefined;
		}

		// Store start callback as
		// may need to init first.
		if (fn)
			this._startCallack = fn;

		/////////////////////////////
		// Wait/Start Facile
		/////////////////////////////

		function handleStart(): void {

			// On listening Handle Callback.
			this.server.on('listening', () => {

				let address = self.server.address(),
						addy = address.address,
						port = address.port;

				if (self._config.auto)
					self.execAfter('core:listen');

				// Call if callack function provided.
				if (self._startCallack)
					self._startCallack(this);

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
			this.log.error('Failed to start Facile missing or invalid configuration.');
			process.exit();
		}

		/////////////////////////////
		// Manual or Auto Init
		/////////////////////////////

		if (this._config.auto) {

			this.log.debug('Auto configuration detected.');

			// Initialize first which will round
			// trip and call start again falling
			// through to the execution below.
			if (!this._initialized) {

				// ensures manual init is not called while auto is set.
				this._autoInit = true;

				this._enableListeners();
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
				this.log.error('Facile failed to start call facile.init() before starting.');
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
	 * @method stop
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
		this.log.debug('Closing active (' + socketKeys.length + ') socket connections.');

		socketKeys.forEach((id) => {
			let socket = this._sockets[id];
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
	 * registerConfig
	 *
	 * @method registerConfig
	 * @param {string} name
	 * @param {...any[]} extendWith
	 *
	 * @memberOf Facile
	 */
	registerConfig(name: string, ...extendWith: any[]): Facile

	/**
	 * registerConfig
	 *
	 * @method registerConfig
	 * @param {IConfigs} configs
	 * @param {...any[]} extendWith
	 *
	 * @memberOf Facile
	 */
	registerConfig(configs: IConfigs, ...extendWith: any[]): Facile;

	registerConfig(name: string | IConfigs, ...extendWith: any[]): Facile {

		let self = this;
		let _configs: IConfig[] = [];

		function normalizeConfigs(arr, reset) {
			if (reset)
				_configs = [{}];
			arr.forEach((c) => {
				if (isString(c))
					_configs.push(self.config(c) || {});
				else if (isPlainObject(c))
					_configs.push(c);
			});
		}

		if (isPlainObject(name)) {
			each(name, (v, k) => {
				normalizeConfigs(extendWith, true);
				_configs.push(v);
				this._configs[k] = extend.apply(null, _configs);
			});
		}

		else {

			normalizeConfigs(extendWith, true);
			this._configs[name as string] = extend.apply(null, _configs);

		}

		return this;

	}

	/**
	 * registerMiddleware
	 *
	 * @method registerMiddleware
	 * @param {IMiddlewares} middlewares
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerMiddleware(middlewares: IMiddlewares): Facile;

	/**
	 * registerMiddleware
	 *
	 * @method registerMiddleware
	 * @param {string} name
	 * @param {IRequestHandler} fn
	 * @param {number} [order]
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerMiddleware(name: string, fn: IRequestHandler, order?: number): Facile;

	/**
	 * registerMiddleware
	 *
	 * @method registerMiddleware
	 * @param {string} name
	 * @param {IErrorRequestHandler} fn
	 * @param {number} [order]
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerMiddleware(name: string, fn: IErrorRequestHandler, order?: number): Facile;

	registerMiddleware(name: string | IMiddlewares, fn?: IRequestHandler | IErrorRequestHandler, order?: number): Facile {

		let middlewares: any = {};

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
	 * registerRoute
	 *
	 * @method registerRoute
	 * @param {IRoutes} routes
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerRoute(routes: IRoutes): Facile;

	/**
	 * registerRoute
	 *
	 * @method registerRoute
	 * @param {Array<IRoute>} routes
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerRoute(routes: Array<IRoute>): Facile;

	/**
	 * registerRoute
	 *
	 * @method registerRoute
	 * @param {IRoute} route
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerRoute(route: IRoute): Facile;

	registerRoute(route: IRoute | IRoutes | IRoute[]): Facile {

		let self = this;

		// Helper function to validate
		// the route and log if invalid.
		function validate(_route: IRoute) {

			// Validate the route.
			_route = utils.validateRoute(_route);

			// Push the route to the collection
			// if is valid.
			if (_route.valid)
				self._routes.push(_route);

			// Otherwise log a warning.
			else
				self.log.warn(`Failed to add route "${_route.url}", the configuration is invalid.`, route);

		}

		// Handle array of route objects.
		if (Array.isArray(route)) {
			let routes = route as Array<IRoute>;
			routes.forEach((r) => {
				validate(r);
			});
		}

		else {

			// single route.
			let _route = route as IRoute;

			if (_route.url) {
				validate(_route);
			}

			// Object of routes.
			else {

				let routes = route as IRoutes;

				each(routes, (v, k) => {
					let rte = utils.parseRoute(k, v);
					validate(rte);
				});

			}

		}

		return this;

	}

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {IPolicies} policies
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: IPolicy): Facile;

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {string} name
	 * @param {IPolicies} policy
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, policy: IPolicy): Facile;

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {string} name
	 * @param {string} action
	 * @param {boolean} policy
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, action: string, policy: boolean): Facile;

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 *
	 * @param {string} name
	 * @param {string} action
	 * @param {string} policy
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, action: string, policy: string): Facile;

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {string} name
	 * @param {string} action
	 * @param {string[]} policy
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, action: string, policy: string[]): Facile;

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {string} name
	 * @param {string} action
	 * @param {IRequestHandler} policy
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, action: string, policy: IRequestHandler): Facile;

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {string} name
	 * @param {string} action
	 * @param {Array<IRequestHandler>} policy
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, action: string, policy: Array<IRequestHandler>): Facile;

	registerPolicy(name: string | IPolicy,
								action?: string | boolean | string[] | IRequestHandler | Array<IRequestHandler> | IPolicy,
								policy?: string | boolean | string[] | IRequestHandler | Array<IRequestHandler>): Facile {

		let self = this;

		function isValidParent(key, val) {

			if (key !== '*' && !isPlainObject(val)) {
				self.log.warn('Invalid policy key "' + key + '" ignored, parent policy values must be objects execpt global policy key.');
				return false;
			}

			else if (key === '*' && (!isString(val) && !Array.isArray(val) && !isBoolean(val))) {
				self.log.warn('Invalid global policy key ignored, only boolean, strings, arrays of string or arrays of functions are supported.');
				return false;
			}

			else if (isPlainObject(val)) {
				let keys = Object.keys(val);
				if (!keys.length) {
					self.log.warn('Invalid policy key "' + key + '" ignored, policies must contain a global or action policies.');
					return false;
				}
			}

			return true;

		}

		// Adding map of policies.
		if (isPlainObject(name)) {

			Object.keys(name).forEach((key) => {

				let val = name[key];
				this._policies[key] = this._policies[key] || {};

				if (isValidParent(key, val)) {
					if (key === '*')
						this._policies[key] = val;
					else
						extend(this._policies[key], val);
				}

			});

		}

		// Adding single policy.
		else if (isPlainObject(action)) {

			let _name = name as string;
			this._policies[_name] = this._policies[_name] || {};
			if (isValidParent(name, action))
				extend(this._policies[_name], action);
		}

		// Adding policy with action plicy.
		else if (policy !== undefined) {

			let _name = name as string;
			let _action;
			this._policies[_name] = this._policies[_name] || {};
			this._policies[_name][_action] = policy;

		}

		return this;

	}

	/**
	 * registerComponent
	 *
	 * @method registerComponent
	 * @param {IComponent} Component
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerComponent(Component: IComponent): Facile;

	/**
	 * registerComponent
	 *
	 * @method registerComponent
	 *
	 * @param {IComponents} components
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerComponent(components: IComponents): Facile;

	/**
	 * registerComponent
	 *
	 * @method registerComponent
	 *
	 * @param {string} name
	 * @param {IComponent} Component
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerComponent(name: string, Component: IComponent): Facile;

	registerComponent(name: string | IComponent | IComponents, Component?: IComponent): Facile {

		let self = this;
		let Comp: any;

		function registerFailed(type) {
				self.log.error('Failed to register using unsupported type "' + type + '".');
				process.exit();
		}

		function registerByType(type) {

			let collection;

			if (type === 'Service')
				collection = self._services as Collection<IService>;
			else if (type === 'Filter')
				collection = self._filters as Collection<IFilter>;
			else if (type === 'Controller')
				collection = self._controllers as Collection<IController>;
			else if (type === 'Model')
				collection = self._models as Collection<IModel>;
			else
				registerFailed(typeof type);

			// If not type try to get name
			// from function/class name.
			if (isFunction(name)) {
				Component = name;
				name = utils.constructorName(name);
			}

			// Adding single component by name and class/function.
			if (isString(name)) {
				collection.add(name, Component);
			}

			// Otherwise iterate object.
			else if (isPlainObject(name)) {
				each(name, (v, k) => {
					collection.add(k, v);
				});
			}

			// Otherwise log error.
			else {
				let failedType = typeof Component || typeof name;
				self.log.error('Failed ot register component using unsupported type "' +
													failedType + ' ".');
			}

			return self;

		}

		// Get the Component Type
		// before attempting to register.
		if (Component)
			Comp = Component;
		else if (isPlainObject(name))
			Comp = values(name)[0];
		else if (isFunction(name))
			Comp = name;
		else
			registerFailed(typeof Component || typeof name);

		return registerByType(Comp.type);


	}

	///////////////////////////////////////////////////
	// INSTANCE HELPERS
	///////////////////////////////////////////////////

	/**
	 * router
	 *
	 * @desc gets or creates a router.
	 * @method router
	 * @param {string} name
	 * @returns {express.Router}
	 *
	 * @memberOf Facile
	 */
	router(name: string, options?: any): express.Router {
		if (!this._routers[name])
			this._routers[name] = express.Router(options);
		return this._routers[name];
	}

	/**
	 * Gets a Config by name.
	 *
	 * @method config
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
	 * @method service
	 * @template T
	 * @param {string} name
	 * @returns {T}
	 *
	 * @memberOf Facile
	 */
	service<T>(name: string): T {
		let collection: Collection<IService> = this._services;
		return collection.get<T>(name);
	}

	/**
	 * Gets a Filter
	 *
	 * @method filter
	 * @template T
	 * @param {string} name
	 * @returns {T}
	 *
	 * @memberOf Facile
	 */
	filter<T>(name: string): T {
		let collection: Collection<IFilter> = this._filters;
		return collection.get<T>(name);
	}

	/**
	 * Gets a Model
	 *
	 * @method model
	 * @template T
	 * @param {string} name
	 * @returns {T}
	 *
	 * @memberOf Facile
	 */
	model<T>(name: string): T {
		let collection: Collection<IModel> = this._models;
		return collection.get<T>(name);
	}

	/**
	 * Gets a Controller.
	 *
	 * @method controller
	 * @template T
	 * @param {string} name
	 * @returns {T}
	 *
	 * @memberOf Facile
	 */
	controller<T>(name: string): T {
		let collection: Collection<IController> = this._controllers;
		return collection.get<T>(name);
	}

	/**
	 * listRoutes
	 *
	 * @desc compiles a list of all routes.
	 * @method listRoutes
	 * @param {string} [router='default']
	 *
	 * @memberOf Facile
	 */
	listRoutes(router: string = 'default'): any {

		let _router = this._routers[router];
		let map = {
			get: [],
			post: [],
			put: [],
			delete: [],
			all: [],
			head: [],
			options: [],
			patch: []
		};

		each(_router.stack, (r) => {
			if (r.route) {
				Object.keys(r.route.methods).forEach((m) => {
					map[m] = map[m] || [];
					map[m].push(r.route.path);
				});
				return map;
			}
		});

		return map;

	}

}
