import * as express from 'express';
import { Core } from './core';
import { IFacile, IConfig, IRoute, IConfigs, IRequestHandler, IRoutes, IInit, IMiddlewares, IComponents, IComponent, IErrorRequestHandler, IPolicy } from '../interfaces';
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
     * core:listen
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
     * @param {...any[]} extendWith
     *
     * @memberOf Facile
     */
    registerConfig(name: string, ...extendWith: any[]): Facile;
    /**
     * registerConfig
     *
     * @method registerConfig
     * @param {IConfigs} configs
     * @param {...any[]} extendWith
     *
     * @memberOf Facile
     */
    registerConfig(configs: IConfigs, ...extendWith: any[]): Facile;
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
    /**
     * registerRoute
     *
     * @method registerRoute
     * @param {IRoute} route
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    registerRoute(route: IRoute): Facile;
    /**
     * registerPolicy
     *
     * @method registerPolicy
     * @param {IPolicies} policies
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    registerPolicy(name: IPolicy): Facile;
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
    registerPolicy(name: string, policy: IPolicy): Facile;
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
     * listRoutes
     *
     * @desc compiles a list of all routes.
     * @method listRoutes
     * @param {string} [router='default']
     *
     * @memberOf Facile
     */
    listRoutes(router?: string): any;
}
