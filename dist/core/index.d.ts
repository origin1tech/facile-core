/// <reference types="node" />
import * as express from 'express';
import { Server } from 'net';
import { Core } from './core';
import { IFacile, IConfig, IRouters, IRoute, IBoom, IFilter, IMiddlewares, ISockets, IModels, IControllers, IModel, IController, IFilters, IConfigs, IRequestHandler, IRoutesMap, IService, IServices, IInit } from '../interfaces';
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
     * Exposes Boom to Facile
     * @member {IBoom} Facile.publicProperty
     * @memberOf Facile
     */
    Boom: IBoom;
    app: express.Express;
    server: Server;
    _routers: IRouters;
    _routes: Array<IRoute>;
    _nextSocketId: number;
    _sockets: ISockets;
    _services: IServices;
    _middlewares: IMiddlewares;
    _filters: IFilters;
    _models: IModels;
    _controllers: IControllers;
    /**
     * Facile constructor.
     * @constructor
     * @memberof Facile
     */
    constructor();
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
     * Enables Lifecycle Listeners.
     *
     * Events
     *
     * core:configure
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
     * @method enableHooks
     * @returns {Facile}
     * @memberOf Facile
     */
    enableEvents(): Facile;
    /**
     * Start Listening for Connections
     *
     * @method
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    listen(): Facile;
    /**
     * Start Server.
     *
     * @method
     * @param {Function} [fn]
     * @method
     * @memberof Facile
     */
    start(config?: string | IConfig | Function, fn?: Function): Facile;
    /**
     * Stops the server.
     *
     * @method
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
     * @method
     * @param {string} name
     * @param {IConfig} config
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    addConfig(name: string | IConfigs, config: IConfig): Facile;
    /**
     * Adds/Creates a Router.
     *
     * @method
     * @param {string} name
     * @param {express.Router} [router]
     * @returns {express.Router}
     *
     * @memberOf Facile
     */
    addRouter(name: string | IRouters, router?: express.Router): express.Router;
    /**
     * Registers Middleware or Middlewares to Express.
     *
     * @method
     * @param {string} name
     * @param {IRequestHandler} fn
     * @param {number} [order]
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    addMiddleware(name: string | IMiddlewares, fn?: IRequestHandler, order?: number): Facile;
    /**
     * Registers a Service.
     *
     * @method
     * @param {(IService | Array<IService>)} Service
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    addService(Service: IService | Array<IService>): Facile;
    /**
     * Registers Filter or Map of Filters.
     *
     * @method
     * @param {(string | IFilters)} name
     * @param {IRequestHandler} fn
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    addFilter(Filter: IFilter | Array<IFilter>): Facile;
    /**
     * Registers a Model.
     *
     * @method
     * @param {(IModel | Array<IModel>)} Model
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    addModel(Model: IModel | Array<IModel>): Facile;
    /**
     * Registers a Controller.
     *
     * @method
     * @param {(IController | Array<IController>)} Controller
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    addController(Controller: IController | Array<IController>): Facile;
    /**
     * Adds a route to the map.
     *
     * @method
     * @param {(string | IRoute)} method
     * @param {string} url
     * @param {(express.Handler | Array<express.Handler>)} handlers
     * @param {string} [router]
     * @returns {RecRent}
     *
     * @memberOf Facile
     */
    addRoute(route: IRoute | IRoutesMap | IRoute[]): Facile;
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
     * Gets a Service by name.
     *
     * @method
     * @param {string} name
     * @returns {IService}
     *
     * @memberOf Facile
     */
    service(name: string): IService;
    /**
     * Gets a Filter by name.
     *
     * @method
     * @param {string} name
     * @returns {IFilter}
     *
     * @memberOf Facile
     */
    filter(name: string): IFilter;
    /**
     * Gets a Model by name.
     *
     * @method
     * @param {string} name
     * @returns {IModel}
     *
     * @memberOf Facile
     */
    model(name: string): IModel;
    /**
     * Gets a Controller by name.
     *
     * @method
     * @param {string} name
     * @returns {IController}
     *
     * @memberOf Facile
     */
    controller(name: string): IController;
    /**
     * Wrapper for utils extend.
     *
     * @param {...any[]} args
     * @returns {*}
     *
     * @memberOf Facile
     */
    extend(...args: any[]): any;
}
