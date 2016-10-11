/// <reference types="node" />
import { LoggerInstance } from 'winston';
import { Express } from 'express';
import { Server } from 'net';
import { EventEmitter } from 'events';
import { ICore, ICallbackResult, ICallback, IConfig, IConfigs, IListenersMap, IBoom, IInit } from '../interfaces';
/**
 * Facile Core
 *
 * @export
 * @class Core
 * @extends {EventEmitter}
 * @implements {IEvents}
 */
export declare class Core extends EventEmitter implements ICore {
    Boom: IBoom;
    express: any;
    app: Express;
    server: Server;
    logger: LoggerInstance;
    _pkg: any;
    _config: IConfig;
    _configs: IConfigs;
    _inits: IInit;
    _listeners: IListenersMap;
    _beforeEvents: any;
    _afterEvents: any;
    _configured: boolean;
    _initialized: boolean;
    _started: boolean;
    _autoInit: boolean;
    /**
     * Creates an instance of Core.
     *
     * @constructor
     * @memberOf Core
     */
    constructor();
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
    before(name: string, event: ICallback): Core;
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
    after(name: string, event: ICallback): Core;
    /**
     * Checks if before listeners exist for event.
     *
     * @member hasBefore
     * @param {string} name
     * @returns {boolean}
     *
     * @memberOf Core
     */
    hasBefore(name: string): boolean;
    /**
     * Checks if after listeners exist for event.
     *
     * @member hasAfter
     * @param {string} name
     * @returns {boolean}
     *
     * @memberOf Core
     */
    hasAfter(name: string): boolean;
    /**
     * Executes before event listeners.
     *
     * @member execBefore
     * @param {string} name
     * @param {ICallbackResult} [fn]
     *
     * @memberOf Core
     */
    execBefore(name: string, fn?: ICallbackResult): void;
    /**
     * Executes after event listeners.
     *
     * @member execAfter
     * @param {string} name
     * @param {ICallbackResult} [fn]
     *
     * @memberOf Core
     */
    execAfter(name: string, fn?: ICallbackResult): void;
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
    execEvents(name: string, type: any, fn?: ICallbackResult): void;
}
