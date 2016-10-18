/// <reference types="node" />
import { LoggerInstance } from 'winston';
import { Express } from 'express';
import { Server } from 'net';
import { EventEmitter } from 'events';
import { ICore, ICallbackResult, ICallback, IConfig, IConfigs, IListenersMap, IErrors, IRouters, ISockets, IRoute, IMiddlewares } from '../interfaces';
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
     * @member {IBoom} Boom
     * @memberOf Core
     */
    _errors: IErrors;
    /**
     * express
     *
     * @member {*} express
     * @memberOf Core
     */
    express: any;
    /**
     * app
     *
     * @member {Express} app
     * @memberOf Core
     */
    app: Express;
    /**
     * server
     *
     * @member {Server} server
     * @memberOf Core
     */
    server: Server;
    /**
     * log
     *
     * @member {LoggerInstance} log
     * @memberOf Core
     */
    log: LoggerInstance;
    /**
     * _pkg
     *
     * @member {*} _pkg
     * @memberOf Core
     */
    _pkg: any;
    /**
     * _apppkg
     *
     * @member {*} _apppkg
     * @memberOf Core
     */
    _apppkg: any;
    /**
     * _config
     *
     * @member {IConfig} _config
     * @memberOf Core
     */
    _config: IConfig;
    /**
     * _configs
     *
     * @member {IConfigs} _configs
     * @memberOf Core
     */
    _configs: IConfigs;
    /**
     * _routers
     *
     * @member {IRouters} _routers
     * @memberOf Core
     */
    _routers: IRouters;
    /**
     * _middlewares
     *
     * @member {IMiddlewaresMap} _middlewares
     * @memberOf Core
     */
    _middlewares: IMiddlewares;
    /**
     * _services
     *
     * @member {*} _services
     * @memberOf Core
     */
    _services: any;
    /**
     * _filters
     *
     * @member {*} _filters
     * @memberOf Core
     */
    _filters: any;
    /**
     * _models
     *
     * @member {*} _models
     * @memberOf Core
     */
    _models: any;
    /**
     * _controllers
     *
     * @member {*} _controllers
     * @memberOf Core
     */
    _controllers: any;
    /**
     * _policies
     *
     * @member {*} _policies
     * @memberOf Core
     */
    _policies: any;
    /**
     * _routes
     *
     * @member {Array<IRoute>} _routes
     * @memberOf Core
     */
    _routes: Array<IRoute>;
    /**
     * _nextSocketId
     *
     * @member {number} _nextSocketId
     * @memberOf Core
     */
    _nextSocketId: number;
    /**
     * _sockets
     *
     * @member {ISockets} _sockets
     * @memberOf Core
     */
    _sockets: ISockets;
    /**
     * _listeners
     *
     * @member _listeners
     * @protected
     * @member {IListenersMap}
     * @memberOf Core
     */
    protected _listeners: IListenersMap;
    /**
     * _beforeEvents
     *
     * @member _beforeEvents
     * @protected
     * @member {*}
     * @memberOf Core
     */
    protected _beforeEvents: any;
    /**
     * _afterEvents
     *
     * @member _afterEvents
     * @protected
     * @member {*}
     * @memberOf Core
     */
    protected _afterEvents: any;
    /**
     * _configured
     *
     * @member _configured
     * @protected
     * @member {boolean}
     * @memberOf Core
     */
    protected _configured: boolean;
    /**
     * _initialized
     *
     * @member _initialized
     * @protected
     * @member {boolean}
     * @memberOf Core
     */
    protected _initialized: boolean;
    /**
     * _started
     *
     * @member _started
     * @protected
     * @member {boolean}
     * @memberOf Core
     */
    protected _started: boolean;
    /**
     * _autoInit
     *
     * @member _autoInit
     * @protected
     * @member {boolean}
     * @memberOf Core
     */
    protected _autoInit: boolean;
    /**
     * _startCallback
     *
     * @member _startCallback
     * @protected
     * @member {Function}
     * @memberOf Core
     */
    protected _startCallack: Function;
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
