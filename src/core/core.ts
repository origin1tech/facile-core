
import { LoggerInstance, Logger, transports, TransportInstance } from 'winston';
import { Express } from 'express';
import { Server, Socket } from 'net';
import { isFunction, each } from 'lodash';
import { EventEmitter } from 'events';
import { series as asyncSeries } from 'async';
import { truncate } from './utils';
import { IFacile, ICore, ICallbackResult, ICallback,
				IConfig, IConfigs, IListenersMap, IBoom } from '../interfaces';

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
	_config: IConfig;
	_configs: IConfigs = {};
	_listeners: IListenersMap;

	beforeEvents: any = {};
	afterEvents: any = {};

	/**
	 * Creates an instance of Core.
	 *
	 * @constructor
	 * @memberOf Core
	 */
	constructor() {

		super();

		this._listeners = {
			'core:configure': { before: false, after: true },
			'init': { before: true, after: true },
			'init:server': { before: true, after: true },
			'init:services': { before: true, after: true },
			'init:filters': { before: true, after: true },
			'init:models': { before: true, after: true },
			'init:controllers': { before: true, after: true },
			'init:routes': { before: true, after: true },
			'init:done': { before: true, after: true },
			'core:start': { before: true, after: true },
		};

		// For each event initialize object.
		each(this._listeners, (v, k) => {
			this.beforeEvents[k] = [];
			this.afterEvents[k] = [];
		});

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
		let arr = this.beforeEvents[name];

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
		let arr = this.afterEvents[name];

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
		return this.beforeEvents[name] && this.beforeEvents[name].length;
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
		return this.afterEvents[name] && this.afterEvents[name].length;
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
		this.execEvents(name, this.beforeEvents, fn);
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
		this.execEvents(name, this.afterEvents, fn);
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
			if (!err)
				this.logger.error(err.message, err);
			fn();
		});

	}

}