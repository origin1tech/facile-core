/// <reference types="node" />
import * as events from 'events';
import * as express from 'express';
import { LoggerInstance } from 'winston';
import { Server } from 'net';
import { IFacile, IConfig, IRouters, IRoute, IBoom, IMiddlewares, ISockets, IModels, IControllers, IModel, IController, IUtils, IFilters, IConfigs, IRequestHandler, IRoutesMap, IService, IServices } from './interfaces';
/**
 * RecRent
 *
 * @class RecRent
 */
export declare class Facile extends events.EventEmitter implements IFacile {
    static instance: Facile;
    Boom: IBoom;
    utils: IUtils;
    app: express.Express;
    server: Server;
    logger: LoggerInstance;
    _pkg: any;
    _config: IConfig;
    _configs: IConfigs;
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
     * Creates an instance of RecRent.
     *
     * @memberOf Facile
     */
    constructor();
    /**
     * Applies Configuration.
     *
     * @param {(string | IConfig)} [config]
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    configure(config?: string | IConfig): Facile;
    /**
     * Starts server listening for connections.
     *
     *
     * @memberOf Facile
     */
    listen(): void;
    /**
     * Start Server.
     *
     * @param {Function} [fn]
     *
     * @memberOf Facile
     */
    start(fn?: Function): Facile;
    /**
     * Stops the server.
     *
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
     * @param {string} name
     * @param {IRequestHandler} fn
     * @param {number} [order]
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    addMiddleware(name: string | IMiddlewares, fn: IRequestHandler, order?: number): Facile;
    /**
     * Registers Filter or Map of Filters.
     *
     * @param {(string | IFilters)} name
     * @param {IRequestHandler} fn
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    addFilter(name: string | IFilters, fn: IRequestHandler): Facile;
    /**
     * Registers a Model.
     *
     * @param {(IModel | Array<IModel>)} Model
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    addModel(Model: IModel | Array<IModel>, instance?: boolean): Facile;
    /**
     * Registers a Controller.
     *
     * @param {(IController | Array<IController>)} Controller
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    addController(Controller: IController | Array<IController>, instance?: boolean): Facile;
    /**
     * Registers a Service.
     *
     * @param {(IService | Array<IService>)} Service
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    addService(Service: IService | Array<IService>, instance?: boolean): Facile;
    /**
     * Adds a route to the map.
     *
     * @param {(string | IRoute)} method
     * @param {string} url
     * @param {(express.Handler | Array<express.Handler>)} handlers
     * @param {string} [router]
     * @returns {RecRent}
     *
     * @memberOf Facile
     */
    addRoute(method: string | IRoute | Array<string> | IRoutesMap, url?: string, handlers?: IRequestHandler | Array<IRequestHandler>, router?: string): Facile;
    /**
     * Gets a Router by name.
     *
     * @param {string} name
     * @returns {express.Router}
     *
     * @memberOf Facile
     */
    router(name: string): express.Router;
    /**
     * Gets a Config by name.
     *
     * @param {string} name
     * @returns {IConfig}
     *
     * @memberOf Facile
     */
    config(name: string): IConfig;
    /**
     * Gets a Filter by name.
     *
     * @param {string} name
     * @returns {IFilter}
     *
     * @memberOf Facile
     */
    filter(name: string): IRequestHandler;
    /**
     * Gets a Model by name.
     *
     * @param {string} name
     * @returns {IModel}
     *
     * @memberOf Facile
     */
    model(name: string): IModel;
    /**
     * Gets a Controller by name.
     *
     * @param {string} name
     * @returns {IController}
     *
     * @memberOf Facile
     */
    controller(name: string): IController;
}
