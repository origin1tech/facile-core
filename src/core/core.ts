import { IFacile, ICore, ICallbackResult, ICallback, IConfig, IConfigs } from '../interfaces';
import { LoggerInstance, Logger, transports, TransportInstance } from 'winston';
import { isFunction } from 'lodash';
import { EventEmitter } from 'events';
import { series as asyncSeries } from 'async';
import { truncate } from './utils';

/**
 * Facile Core
 *
 * @export
 * @class Core
 * @extends {EventEmitter}
 * @implements {IEvents}
 */
export class Core extends EventEmitter implements ICore {

	logger: LoggerInstance;

	_pkg: any;
	_config: IConfig;
	_configs: IConfigs = {};

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

		let events = [
			'init',
			'init:server',
			'init:services',
			'init:filters',
			'init:models',
			'init:controllers',
			'init:routes',
			'init:done',
			'core:listening'
		];

		// For each event initialize object.
		events.forEach((ev) => {
			this.beforeEvents[ev] = [];
			this.afterEvents[ev] = [];
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