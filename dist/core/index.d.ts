import * as express from 'express';
import { Core } from './core';
import { IFacile, IConfig, IRoute, IConfigs, IRequestHandler, IRoutes, IInit, IMiddlewares, IComponents, IComponent, IErrorRequestHandler, IPolicies } from '../interfaces';
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
     * registerConfig
     *
     * @method registerConfig
     * @param {string} name
     * @param {...any[]} extend
     *
     * @memberOf Facile
     */
    registerConfig(name: string, ...extend: any[]): Facile;
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
    /**
     * registerRoute
     *
     * @method registerRoute
     * @param {Array<IRoute>} routes
     * @returns {IFacile}
     *
     * @memberOf Facile
     */
    registerRoute(routes: Array<IRoute>): IFacile;
    /**
     * registerRoute
     *
     * @method registerRoute
     * @param {IRoutes} routes
     * @returns {IFacile}
     *
     * @memberOf Facile
     */
    registerRoute(routes: IRoutes): IFacile;
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
    registerPolicy(name: string, filter: boolean): Facile;
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
    registerPolicy(name: string, filter: string): Facile;
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
    registerPolicy(name: string, filter: string[]): Facile;
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
    registerPolicy(name: string, filter: IRequestHandler): Facile;
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
    registerPolicy(name: string, filter: Array<IRequestHandler>): Facile;
    /**
     * registerPolicy
     *
     * @method registerPolicy
     * @param {IPolicies} policies
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    registerPolicy(policies: IPolicies): Facile;
    /**
     * registerComponent
     *
     * @method registerComponent
     * @param {IComponent} Component
     * @returns {IFacile}
     *
     * @memberOf Facile
     */
    registerComponent(Component: IComponent): IFacile;
    /**
     * registerComponent
     *
     * @method registerComponent
     *
     * @param {IComponents} components
     * @returns {IFacile}
     *
     * @memberOf Facile
     */
    registerComponent(components: IComponents): IFacile;
    /**
     * registerComponent
     *
     * @method registerComponent
     *
     * @param {string} name
     * @param {IComponent} Component
     * @returns {IFacile}
     *
     * @memberOf Facile
     */
    registerComponent(name: string, Component: IComponent): IFacile;
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
    router(name: string, options?: any): express.Router;
    /**
     * Gets a Config by name.
     *
     * @method config
     * @param {string} name
     * @returns {IConfig}
     *
     * @memberOf Facile
     */
    config(name: string): IConfig;
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
    service<T>(name: string): T;
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
    filter<T>(name: string): T;
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
    model<T>(name: string): T;
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
    controller<T>(name: string): T;
    /**
     * Convenience wrapper for lodash extend.
     *
     * @method extend
     * @param {...any[]} args
     * @returns {*}
     *
     * @memberOf Facile
     */
    extend(...args: any[]): any;
}
