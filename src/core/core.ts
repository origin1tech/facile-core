
import { LoggerInstance, Logger, transports, TransportInstance } from 'winston';
import { Express } from 'express';
import { Server, Socket } from 'net';
import { isFunction, each } from 'lodash';
import { EventEmitter } from 'events';
import { series as asyncSeries } from 'async';
import { truncate } from './utils';
import { IFacile, ICore, ICallbackResult, ICallback,
				IConfig, IConfigs, IListenersMap, IBoom, IInit,
				IRouters, ISockets, IRoute } from '../interfaces';
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

	Boom: IBoom;
	express: any;
	app: Express;
	server: Server;
	logger: LoggerInstance;

	_pkg: any;
	_apppkg: any;

	_config: IConfig;
	_configs: IConfigs = {};
	_routers: IRouters = {};

	_middlewares: any;
	_services: any;
	_filters: any;
	_models: any;
	_controllers: any;
	_routes: Array<IRoute> = [];

	_nextSocketId: number = 0;
	_sockets: ISockets = {};

	protected _listeners: IListenersMap;
	protected _beforeEvents: any = {};
	protected _afterEvents: any = {};
	protected _configured: boolean;
	protected _initialized: boolean = false;
	protected _started: boolean = false;
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
		this._middlewares = new Collection('middleware');

	}

	/**
	 * Adds before event listener
	 * to known Facile event.
	 *
	 * @member before
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
	 * @member after
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
	 * @member hasBefore
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
	 * @member hasAfter
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
	 * @member execBefore
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
	 * @member execAfter
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
	 * @member execEvents
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