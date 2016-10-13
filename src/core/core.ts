
import { LoggerInstance, Logger, transports, TransportInstance } from 'winston';
import { Express } from 'express';
import { Server, Socket } from 'net';
import { isFunction, each } from 'lodash';
import { EventEmitter } from 'events';
import { series as asyncSeries } from 'async';
import { truncate } from './utils';
import { IFacile, ICore, ICallbackResult, ICallback,
				IConfig, IConfigs, IListenersMap, IBoom, IInit,
				IRouters, ISockets, IRoute, IMiddlewaresMap } from '../interfaces';
import { Collection } from './collection';

/**
 * Facile Core
 *
 * @export
 * @class Core
 * @extends {EventEmitter}
 * @implements {IEvents}
 */
export class Core extends EventEmitter implements ICore {

	/**
	 * Boom
	 *
	 * @member Boom
	 * @type {IBoom}
	 * @memberOf Core
	 */
	Boom: IBoom;

	/**
	 * express
	 *
	 * @member express
	 * @type {*}
	 * @memberOf Core
	 */
	express: any;

	/**
	 * app
	 *
	 * @member app
	 * @type {Express}
	 * @memberOf Core
	 */
	app: Express;

	/**
	 * server
	 *
	 * @member server
	 * @type {Server}
	 * @memberOf Core
	 */
	server: Server;

	/**
	 * logger
	 *
	 * @member logger
	 * @type {LoggerInstance}
	 * @memberOf Core
	 */
	logger: LoggerInstance;

	/**
	 * _pkg
	 *
	 * @member _pkg
	 * @type {*}
	 * @memberOf Core
	 */
	_pkg: any;

	/**
	 * _apppkg
	 *
	 * @member _apppkg
	 * @type {*}
	 * @memberOf Core
	 */
	_apppkg: any;

	/**
	 * _config
	 *
	 * @member _config
	 * @type {IConfig}
	 * @memberOf Core
	 */
	_config: IConfig;

	/**
	 * _configs
	 *
	 * @member _configs
	 * @type {IConfigs}
	 * @memberOf Core
	 */
	_configs: IConfigs = {};

	/**
	 * _routers
	 *
	 * @member _routers
	 * @type {IRouters}
	 * @memberOf Core
	 */
	_routers: IRouters = {};

	/**
	 * _middlewares
	 *
	 * @member _middlewares
	 * @type {IMiddlewaresMap}
	 * @memberOf Core
	 */
	_middlewares: IMiddlewaresMap = {};

	/**
	 * _services
	 *
	 * @member _services
	 * @type {*}
	 * @memberOf Core
	 */
	_services: any;

	/**
	 * _filters
	 *
	 * @member _filters
	 * @type {*}
	 * @memberOf Core
	 */
	_filters: any;

	/**
	 * _models
	 *
	 * @member _models
	 * @type {*}
	 * @memberOf Core
	 */
	_models: any;

	/**
	 * _controllers
	 *
	 * @member _controllers
	 * @type {*}
	 * @memberOf Core
	 */
	_controllers: any;

	/**
	 * _routes
	 *
	 * @member _routes
	 * @type {Array<IRoute>}
	 * @memberOf Core
	 */
	_routes: Array<IRoute> = [];

	/**
	 * _nextSocketId
	 *
	 * @member _nextSocketId
	 * @type {number}
	 * @memberOf Core
	 */
	_nextSocketId: number = 0;

	/**
	 * _sockets
	 *
	 * @member _sockets
	 * @type {ISockets}
	 * @memberOf Core
	 */
	_sockets: ISockets = {};

	/**
	 * _listeners
	 *
	 * @member _listeners
	 * @protected
	 * @type {IListenersMap}
	 * @memberOf Core
	 */
	protected _listeners: IListenersMap;

	/**
	 * _beforeEvents
	 *
	 * @member _beforeEvents
	 * @protected
	 * @type {*}
	 * @memberOf Core
	 */
	protected _beforeEvents: any = {};

	/**
	 * _afterEvents
	 *
	 * @member _afterEvents
	 * @protected
	 * @type {*}
	 * @memberOf Core
	 */
	protected _afterEvents: any = {};

	/**
	 * _configured
	 *
	 * @member _configured
	 * @protected
	 * @type {boolean}
	 * @memberOf Core
	 */
	protected _configured: boolean;

	/**
	 * _initialized
	 *
	 * @member _initialized
	 * @protected
	 * @type {boolean}
	 * @memberOf Core
	 */
	protected _initialized: boolean = false;

	/**
	 * _started
	 *
	 * @member _started
	 * @protected
	 * @type {boolean}
	 * @memberOf Core
	 */
	protected _started: boolean = false;

	/**
	 * _autoInit
	 *
	 * @member _autoInit
	 * @protected
	 * @type {boolean}
	 * @memberOf Core
	 */
	protected _autoInit: boolean = false;

	/**
	 * Creates an instance of Core.
	 *
	 * @constructor
	 * @memberOf Core
	 */
	constructor() {

		super();

		this._listeners = {
			'init': { before: true, after: true },
			'init:server': { before: true, after: true },
			'init:services': { before: true, after: true },
			'init:filters': { before: true, after: true },
			'init:models': { before: true, after: true },
			'init:controllers': { before: true, after: true },
			'init:routes': { before: true, after: true },
			'init:done': { before: true, after: true },
			'core:start': { before: true, after: true },
			'core:listening': { before: true, after: false }
		};

		// For each event initialize object.
		each(this._listeners, (v, k) => {
			this._beforeEvents[k] = [];
			this._afterEvents[k] = [];
		});

		// Init Component collections.
		this._services = new Collection('services');
		this._filters = new Collection('filters');
		this._models = new Collection('models');
		this._controllers = new Collection('controllers');

	}

	/**
	 * Adds before event listener
	 * to known Facile event.
	 *
	 * @method before
	 * @param {string} name the name of the Facile event.
	 * @param {Function} event the event to be called.
	 *
	 * @memberOf Core
	 */
	before(name: string, event: ICallback): Core {

		if (!this._listeners[name].before) {
			this.logger.warn('Listener: ' + name + ' has no event "before".');
			return this;
		}

		// Get var to collection.
		let arr = this._beforeEvents[name];

		// Add the event.
		arr.push(event);

		return this;

	}

	/**
	 * Adds after event listener
	 * to known Facile event.
	 *
	 * @method after
	 * @param {string} name the name of the Facile event.
	 * @param {Function} event the event to be called.
	 *
	 * @memberOf Core
	 */
	after(name: string, event: ICallback): Core {

		if (!this._listeners[name].after) {
			this.logger.warn('Listener: ' + name + ' has no event "after".');
			return this;
		}

		// Get var to collection.
		let arr = this._afterEvents[name];

		// Add the event.
		arr.push(event);

		return this;

	}

	/**
	 * Checks if before listeners exist for event.
	 *
	 * @method hasBefore
	 * @param {string} name
	 * @returns {boolean}
	 *
	 * @memberOf Core
	 */
	hasBefore(name: string): boolean {
		return this._beforeEvents[name] && this._beforeEvents[name].length;
	}

	/**
	 * Checks if after listeners exist for event.
	 *
	 * @method hasAfter
	 * @param {string} name
	 * @returns {boolean}
	 *
	 * @memberOf Core
	 */
	hasAfter(name: string): boolean {
		return this._afterEvents[name] && this._afterEvents[name].length;
	}

	/**
	 * Executes before event listeners.
	 *
	 * @method execBefore
	 * @param {string} name
	 * @param {ICallbackResult} [fn]
	 *
	 * @memberOf Core
	 */
	execBefore(name: string, fn?: ICallbackResult): void {
		this.execEvents(name, this._beforeEvents, fn);
	}

	/**
	 * Executes after event listeners.
	 *
	 * @method execAfter
	 * @param {string} name
	 * @param {ICallbackResult} [fn]
	 *
	 * @memberOf Core
	 */
	execAfter(name: string, fn?: ICallbackResult): void {
		this.execEvents(name, this._afterEvents, fn);
	}

	/**
	 * Executes lifecyle events for
	 * a known Facile event.
	 *
	 * @example
	 *
	 * In the example below each "before"
	 * event funciton is called in series
	 * until completed. Calling the callback
	 * is required in each lifecycle event.
	 *
	 * facile.before('init:server', (done) => {
	 *
	 * 		// do something before server init.
	 * 		// call done when finished.
	 * 		done();
	 *
	 * 		// If there's an error pass to
	 * 		// done method and it will be logged.
	 * 		// done(err);
	 *
	 * 		// To exit simply return the callback.
	 * 		// return done();
	 *
	 * });
	 *
	 * @method execEvents
	 * @param {string} name
	 * @param {string} type
	 * @param {ICallback} [fn]
	 *
	 * @memberOf Core
	 */
	execEvents(name: string, type: any, fn?: ICallbackResult): void {

		// Get the events collection.
		let events = type[name];

		// Execute events in series.
		asyncSeries(events, (err) => {
			if (err)
				this.logger.error(err.message || 'Unknown error', err);
			if (isFunction(fn))
				fn();
		});

	}

}