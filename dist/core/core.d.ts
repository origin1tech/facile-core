/// <reference types="node" />
import { LoggerInstance } from 'winston';
import { Express } from 'express';
import { Server } from 'net';
import { EventEmitter } from 'events';
import { ICore, ICallbackResult, ICallback, IConfig, IConfigs, IListenersMap, IBoom, IRouters, ISockets, IRoute, IMiddlewares } from '../interfaces';
/**
 * Facile Core
 *
 * @export
 * @class Core
 * @extends {EventEmitter}
 * @implements {IEvents}
 */
export declare class Core extends EventEmitter implements ICore {
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
    _configs: IConfigs;
    /**
     * _routers
     *
     * @member _routers
     * @type {IRouters}
     * @memberOf Core
     */
    _routers: IRouters;
    /**
     * _middlewares
     *
     * @member _middlewares
     * @type {IMiddlewaresMap}
     * @memberOf Core
     */
    _middlewares: IMiddlewares;
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
     * _policies
     *
     * @member _policies
     * @type {*}
     * @memberOf Core
     */
    _policies: any;
    /**
     * _routes
     *
     * @member _routes
     * @type {Array<IRoute>}
     * @memberOf Core
     */
    _routes: Array<IRoute>;
    /**
     * _nextSocketId
     *
     * @member _nextSocketId
     * @type {number}
     * @memberOf Core
     */
    _nextSocketId: number;
    /**
     * _sockets
     *
     * @member _sockets
     * @type {ISockets}
     * @memberOf Core
     */
    _sockets: ISockets;
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
    protected _beforeEvents: any;
    /**
     * _afterEvents
     *
     * @member _afterEvents
     * @protected
     * @type {*}
     * @memberOf Core
     */
    protected _afterEvents: any;
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
    protected _initialized: boolean;
    /**
     * _started
     *
     * @member _started
     * @protected
     * @type {boolean}
     * @memberOf Core
     */
    protected _started: boolean;
    /**
     * _autoInit
     *
     * @member _autoInit
     * @protected
     * @type {boolean}
     * @memberOf Core
     */
    protected _autoInit: boolean;
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
     * @method before
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
     * @method after
     * @param {string} name the name of the Facile event.
     * @param {Function} event the event to be called.
     *
     * @memberOf Core
     */
    after(name: string, event: ICallback): Core;
    /**
     * Checks if before listeners exist for event.
     *
     * @method hasBefore
     * @param {string} name
     * @returns {boolean}
     *
     * @memberOf Core
     */
    hasBefore(name: string): boolean;
    /**
     * Checks if after listeners exist for event.
     *
     * @method hasAfter
     * @param {string} name
     * @returns {boolean}
     *
     * @memberOf Core
     */
    hasAfter(name: string): boolean;
    /**
     * Executes before event listeners.
     *
     * @method execBefore
     * @param {string} name
     * @param {ICallbackResult} [fn]
     *
     * @memberOf Core
     */
    execBefore(name: string, fn?: ICallbackResult): void;
    /**
     * Executes after event listeners.
     *
     * @method execAfter
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
     * @method execEvents
     * @param {string} name
     * @param {string} type
     * @param {ICallback} [fn]
     *
     * @memberOf Core
     */
    execEvents(name: string, type: any, fn?: ICallbackResult): void;
}
