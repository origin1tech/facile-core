import * as express from 'express';
import { Core } from './core';
import { IFacile, IConfig, IRouters, IRoute, IConfigs, IRequestHandler, IRoutesMap, IInit, IMiddlewaresMap, IComponentsMap, IComponent, IErrorRequestHandler } from '../interfaces';
/**
 * Facile Core
 *
 * @export
 * @class Facile
 * @extends {Events}
 * @implements {IFacile}
 */
export declare class Facile extends Core implements IFacile {
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
    constructor();
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
    private _enableListeners();
    /**
     * Start Listening for Connections
     *
     * @private
     * @method _listen
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    private _listen();
    /**
     * Configure
       *
     * @method configure
     * @param {(string | IConfig)} [config]
     * @returns {Facile}
     * @memberOf Facile
     */
    configure(config?: string | IConfig): Facile;
    /**
     * Returns Initialization Methods
     *
     * @method init
     * @returns {IInit}
     * @memberOf Facile
     */
    init(): IInit;
    /**
     * Start Server.
     *
     * @method start
     * @param {Function} [fn]
     * @method
     * @memberof Facile
     */
    start(config?: string | IConfig | Function, fn?: Function): Facile;
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
    stop(msg?: string, code?: number): void;
    /**
     * Adds a Configuration.
     *
     * @method registerConfig
     * @param {string} name
     * @param {IConfig} config
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    registerConfig(name: string | IConfigs, config: IConfig): Facile;
    /**
     * Adds/Creates a Router.
     *
     * @method registerRouter
     * @param {string} name
     * @param {express.Router} [router]
     * @returns {express.Router}
     *
     * @memberOf Facile
     */
    registerRouter(name: string | IRouters, router?: express.Router): express.Router;
    /**
     * Registers Middleware or Middlewares to Express.
     *
     * @method registerMiddleware
     * @param {string} name
     * @param {IRequestHandler} fn
     * @param {number} [order]
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    registerMiddleware(name: string | IMiddlewaresMap, fn?: IRequestHandler | IErrorRequestHandler, order?: number): Facile;
    /**
     * Adds a route to the map.
     *
     * @method registerRoute
     * @param {(string | IRoute)} method
     * @param {string} url
     * @param {(express.Handler | Array<express.Handler>)} handlers
     * @param {string} [router]
     * @returns {RecRent}
     *
     * @memberOf Facile
     */
    registerRoute(route: IRoute | IRoutesMap | IRoute[]): Facile;
    registerComponent(Component: IComponent): IFacile;
    registerComponent(components: IComponentsMap): IFacile;
    registerComponent(name: string, Component: IComponent): IFacile;
    component(name: string, map: any): any;
    /**
     * Gets a Router by name.
     *
     * @method
     * @param {string} name
     * @returns {express.Router}
     *
     * @memberOf Facile
     */
    router(name: string): express.Router;
    /**
     * Gets a Config by name.
     *
     * @method
     * @param {string} name
     * @returns {IConfig}
     *
     * @memberOf Facile
     */
    config(name: string): IConfig;
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
    service<T>(name: string): T;
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
    filter<T>(name: string): T;
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
    model<T>(name: string): T;
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
    controller<T>(name: string): T;
    /**
     * Convenience wrapper for lodash extend.
     *
     * @member extend
     * @param {...any[]} args
     * @returns {*}
     *
     * @memberOf Facile
     */
    extend(...args: any[]): any;
    /**
     * Extends configuration files.
     *
     * @member extendConfig
     * @param {...any[]} configs
     * @returns {IConfig}
     *
     * @memberOf Facile
     */
    extendConfig(...configs: any[]): IConfig;
}
