
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
				isString, maxBy, has, isBoolean, bind, values } from 'lodash';
import { red, cyan } from 'chalk';

// Internal Dependencies.
import * as utils from './utils';
import { Core } from './core';
import * as defaults from './defaults';
import { IFacile, ICertificate, IConfig, IRouters, IRoute,
				IBoom, ICallbackResult, IFilter,
				IMiddleware, ISockets, IModel, IController,
				IUtils, IConfigs, IRequestHandler, IRoutes, IService,
				IViewConfig, IInit, ICallback, IMiddlewares, IComponents,
				IComponent, IErrorRequestHandler, IPolicies } from '../interfaces';
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
		this.logger = defaultLogger;

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
		 * @returns {Facile}
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
	 * @method start
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
	 * registerConfig
	 *
	 * @method registerConfig
	 * @param {string} name
	 * @param {...any[]} extend
	 *
	 * @memberOf Facile
	 */
	registerConfig(name: string, ...extend: any[]): Facile

	/**
	 * registerConfig
	 *
	 * @method registerConfig
	 * @param {IConfigs} configs
	 * @param {...any[]} extend
	 *
	 * @memberOf Facile
	 */
	registerConfig(configs: IConfigs, ...extend: any[]): Facile;
	registerConfig(name: string | IConfigs, ...extend: any[]): Facile {

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
				normalizeConfigs(extend, true);
				_configs.push(v);
				this._configs[k] = _extend.apply(null, _configs);
			});
		}

		else {

			normalizeConfigs(extend, true);
			this._configs[name as string] = _extend.apply(null, _configs);

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
			let routes = route as IRoutes;
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

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {IPolicies} policies
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: IPolicies): Facile;

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {string} name
	 * @param {boolean} filter
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, policy: boolean): Facile;

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {string} name
	 * @param {string} filter
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, policy: string): Facile;

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {string} name
	 * @param {string[]} filter
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, policy: string[]): Facile;

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {string} name
	 * @param {IRequestHandler} filter
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, policy: IRequestHandler): Facile;

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {string} name
	 * @param {Array<IRequestHandler>} filter
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, policy: Array<IRequestHandler>): Facile;

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
	registerPolicy(name: string, policy: IPolicies): Facile;

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

	/**
	 * registerPolicy
	 *
	 * @method registerPolicy
	 * @param {string} name
	 * @param {string} action
	 * @param {IPolicies} policy
	 * @returns {Facile}
	 *
	 * @memberOf Facile
	 */
	registerPolicy(name: string, action: string, policy: IPolicies): Facile;

	registerPolicy(name: string | IPolicies,
								action?: string | boolean | string[] | IRequestHandler | Array<IRequestHandler> | IPolicies,
								policy?: string | boolean | string[] | IRequestHandler | Array<IRequestHandler> | IPolicies): Facile {

		let self = this;

		function isValidParent(key, val) {
			if (key !== '*' && !isPlainObject(val)) {
				self.logger.warn('Invalid parent policy key "' + key + '" ignored, parent policy values must be objects execpt global policy key.');
				return false;
			}
			else if (key === '*' && (!isString(val) && !Array.isArray(val)) || isPlainObject(val)) {
				self.logger.warn('Invalid global policy key ignored, only boolean, strings, arrays of string or arrays of functions are supported.');
				return false;
			}
			return true;
		}

		// Adding policy with action plicy.
		if (arguments.length === 3) {

		}

		// Adding map of policies.
		else if (isPlainObject(name)) {

			Object.keys(name).forEach((key) => {

				let val = Object[key];
				this._policies[key] = this._policies[key] || {};

				if (isValidParent(key, val)) {
					if (key === '*')
						this._policies[key] = val;
					else
						this._policies[key] = _extend(this._policies[key], val);
				}

			});

		}

		// Adding single policy.
		else {

			this._policies[name as string] = this._policies[name as string] || {};
			// if (isValidParent(name, action))


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
				self.logger.error('Failed to register using unsupported type "' + type + '".');
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
				self.logger.error('Failed ot register component using unsupported type "' +
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
		let component: T = this._services[name];
		return component;
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
		let component: T = this._filters[name];
		return component;
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
		let component: T = this._models[name];
		return component;
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
		let component: T = this._controllers[name];
		return component;
	}

	/**
	 * Convenience wrapper for lodash extend.
	 *
	 * @method extend
	 * @param {...any[]} args
	 * @returns {*}
	 *
	 * @memberOf Facile
	 */
	extend(...args: any[]): any {
		return _extend.apply(null, args);
	}

}
