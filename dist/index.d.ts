// Generated by dts-bundle v0.6.1
// Dependencies for this module:
//   ../express
//   ../events
//   ../net
//   ../boom
//   ../winston

declare module 'facile' {
    import { Facile } from 'facile/core';
    export let facile: Facile;
    export * from 'facile/interfaces';
    export * from 'facile/types';
}

declare module 'facile/core' {
    import * as express from 'express';
    import { Core } from 'facile/core/core';
    import { IFacile, IConfig, IRouters, IRoute, IFilter, IMiddlewares, ISockets, IModels, IControllers, IModel, IController, IFilters, IConfigs, IRoutesMap, IService, IServices, IInit } from 'facile/interfaces';
    /**
        * Facile Core
        *
        * @export
        * @class Facile
        * @extends {Events}
        * @implements {IFacile}
        */
    export class Facile extends Core implements IFacile {
            /**
                * Singleton instance of Facile
                *
                * @static
                * @member {Facile} Facile.staticProperty
                * @memberOf Facile
                */
            static instance: Facile;
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
            addMiddleware(name: string | IMiddlewares, fn?: any, order?: number): Facile;
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
}

declare module 'facile/interfaces' {
    import { EventEmitter } from 'events';
    import { Router, RequestHandler, NextFunction, ErrorRequestHandler, Request, Response, Express } from 'express';
    import { Socket, Server } from 'net';
    import { BoomError, Output } from 'boom';
    import { LoggerInstance } from 'winston';
    export interface IRequestHandler extends RequestHandler {
    }
    export interface INextFunction extends NextFunction {
    }
    export interface IErrorRequestHandler extends ErrorRequestHandler {
    }
    export interface IRequest extends Request {
    }
    export interface IResponse extends Response {
    }
    export interface IBoomError extends BoomError {
    }
    export interface IBoomOutput extends Output {
    }
    export interface IUtils {
            extend(...args: any[]): any;
            extendMap(key: any, val: any, obj?: any): void;
            initMap(Type: any, obj: any, instance?: any): void;
            maxIn(obj: any, key: string): number;
            hasIn(obj: any, key: any, val: any): boolean;
            parseRoute(url: string, handler: IRequestHandler | Array<IRequestHandler> | string | IRoute): IRoute;
            validateRoute(route: IRoute): IRoute;
            noop(): void;
            truncate(str: string, length: number, omission: string): string;
    }
    export interface IInit {
            run(): IInit;
            server(): IInit;
            services(): IInit;
            filters(): IInit;
            models(): IInit;
            controllers(): IInit;
            routes(): IInit;
            all(): IFacile;
            done(): IFacile;
    }
    export interface IListenersMap {
            [name: string]: {
                    before: boolean;
                    after: boolean;
            };
    }
    export interface ICore extends EventEmitter {
            Boom: IBoom;
            express: any;
            app: Express;
            server: Server;
            logger: LoggerInstance;
            _pkg: any;
            _config: IConfig;
            _configs: IConfigs;
            _listeners: IListenersMap;
            beforeEvents: any;
            afterEvents: any;
            before(name: string, event: ICallback): ICore;
            after(name: string, event: ICallback): ICore;
            hasBefore(name: string): boolean;
            hasAfter(name: string): boolean;
            execBefore(name: string, fn?: ICallbackResult): void;
            execAfter(name: string, fn?: ICallbackResult): void;
            execEvents(name: string, type: string, fn?: ICallbackResult): void;
    }
    export interface IFacile extends ICore {
            _routers: IRouters;
            _routes: Array<IRoute>;
            _nextSocketId: number;
            _sockets: ISockets;
            _services: IServices;
            _middlewares: IMiddlewares;
            _filters: IFilters;
            _models: IModels;
            _controllers: IControllers;
            configure(config?: string | IConfig): IFacile;
            init(): IInit;
            enableEvents(): IFacile;
            listen(): IFacile;
            start(config?: string | IConfig | Function, fn?: Function): IFacile;
            stop(msg?: string, code?: number): void;
            addConfig(name: string, config: IConfig): IFacile;
            addRouter(name: string, router?: Router): Router;
            addMiddleware(name: string, fn?: any, order?: number): IFacile;
            addService(Service: IService | Array<IService>): IFacile;
            addFilter(Filter: IFilter | Array<IFilter>): IFacile;
            addModel(Model: IModel | Array<IModel>): IFacile;
            addController(Controller: IController | Array<IController>): IFacile;
            addService(Service: IService | Array<IService>, instance?: boolean): IFacile;
            addRoute(method: string | string[] | IRoutesMap | IRoute[], url?: string, handler?: IRequestHandler, filters?: IRequestHandler | IRequestHandler[], router?: string): IFacile;
            config(name: string): IConfig;
            filter(name: string): IFilter;
            service(name: string): IService;
            model(name: string): IModel;
            controller(name: string): IController;
            extend(...args: any[]): any;
    }
    /**
        * SSL Certificate Interface.
        *
        * @export
        * @interface ICertificate
        */
    export interface ICertificate {
            key: string;
            cert: string;
    }
    /**
        * Node style callback.
        * @todo should probably support promise also.
        *
        * @export
        * @interface ICallback
        */
    export interface ICallbackResult {
            (err?: string | Error, data?: any): void;
    }
    export interface ICallback {
            (done: ICallbackResult): void;
    }
    /**
        * Name and renderer for views.
        * @todo create custon interface
        * for renderer. consolidate should
        * but does not export the interface
        * in typings.
        *
        * @export
        * @interface IViewEngine
        */
    export interface IViewEngine {
            name: string;
            renderer: string | Function;
    }
    /**
        * Express View Settings
        *
        * @export
        * @interface IExpressViews
        */
    export interface IViewConfig {
            layout?: string;
            engine?: IViewEngine;
            'view engine'?: string;
            views?: string | string[] | boolean;
    }
    /**
        * Server Configuration.
        *
        * @export
        * @interface IConfig
        */
    export interface IConfig {
            cwd?: string;
            pkg?: any;
            host?: string;
            port?: number;
            certificate?: ICertificate | true;
            maxConnections?: number;
            env?: string;
            logger?: LoggerInstance;
            logLevel?: 'error' | 'warn' | 'info' | 'debug';
            views?: IViewConfig;
            database?: any;
            auto?: boolean;
    }
    /**
        * Map of Configs.
        *
        * @export
        * @interface IConfigs
        */
    export interface IConfigs {
            [name: string]: IConfig;
    }
    /**
        * Interface for configuration flags.
        *
        * @export
        * @interface IFlags
        */
    export interface IFlags {
            [name: string]: any;
    }
    /**
        * Map containing socket connections.
        *
        * @export
        * @interface ISockets
        */
    export interface ISockets {
            [id: number]: Socket;
    }
    /**
        * Map of app middleware.
        *
        * @export
        * @interface IMiddleware
        */
    export interface IMiddleware {
            fn: any;
            order?: number;
    }
    /**
        * Map of middleware.
        *
        * @export
        * @interface IMiddlewares
        */
    export interface IMiddlewares {
            [name: string]: IMiddleware;
    }
    /**
        * Boom wrap event signature interface.
        *
        * @export
        * @interface IBoomWrap
        */
    export interface IBoomWrap {
            (error: Error, statusCode?: number, message?: string): BoomError;
    }
    /**
        * Boom create signature interface.
        *
        * @export
        * @interface IBoomCreate
        */
    export interface IBoomCreate {
            (statusCode: number, message?: string, data?: any): BoomError;
    }
    /**
        * Boom event signature interface.
        *
        * @export
        * @interface IBoomEvent
        */
    export interface IBoomEvent {
            (message?: string, data?: any): BoomError;
    }
    /**
        * Interface used to extend framework with
        * standard Boom error events.
        *
        * @export
        * @interface IBoom
        */
    export interface IBoom {
            wrap: IBoomWrap;
            create: IBoomCreate;
            badRequest: IBoomEvent;
            unauthorized: IBoomEvent;
            forbidden: IBoomEvent;
            notFound: IBoomEvent;
            notImplemented: IBoomEvent;
            badGateway: IBoomEvent;
    }
    /**
        * Router Interface Map.
        *
        * @export
        * @interface IRouters
        */
    export interface IRouters {
            [name: string]: Router;
    }
    /**
        * Route Interface.
        *
        * @export
        * @interface IRoute
        */
    export interface IRoute {
            method?: string | Array<string>;
            url?: string | Array<string>;
            handler?: IRequestHandler;
            filters?: IRequestHandler | Array<IRequestHandler>;
            view?: string;
            redirect?: string;
            router?: string;
            valid?: boolean;
    }
    /**
        * Interface for Routes by Map.
        *
        * @export
        * @interface IRoutesMap
        */
    export interface IRoutesMap {
            [url: string]: IRequestHandler | Array<IRequestHandler> | string | IRoute;
    }
    /**
        * Filter Interface.
        *
        * @export
        * @interface IFilter
        */
    export interface IFilter {
    }
    /**
        * Map of Filters.
        *
        * @export
        * @interface IFilters
        */
    export interface IFilters {
            [name: string]: IFilter;
    }
    /**
        * Service Interface
        *
        * @export
        * @interface IService
        */
    export interface IService {
    }
    /**
        * Map of Services
        *
        * @export
        * @interface IServices
        */
    export interface IServices {
            [name: string]: IService;
    }
    /**
        * Model interface.
        *
        * @export
        * @interface IModel
        */
    export interface IModel {
    }
    /**
        * Map of IModels.
        *
        * @export
        * @interface IModels
        */
    export interface IModels {
            [name: string]: IModel;
    }
    /**
        * Controller Interface.
        *
        * @export
        * @interface IController
        */
    export interface IController {
    }
    /**
        * Map of Controllers.
        *
        * @export
        * @interface IControllers
        */
    export interface IControllers {
            [name: string]: IController;
    }
}

declare module 'facile/types' {
    export * from 'facile/types/service';
    export * from 'facile/types/filter';
    export * from 'facile/types/model';
    export * from 'facile/types/controller';
}

declare module 'facile/core/core' {
    import { LoggerInstance } from 'winston';
    import { Express } from 'express';
    import { Server } from 'net';
    import { EventEmitter } from 'events';
    import { ICore, ICallbackResult, ICallback, IConfig, IConfigs, IListenersMap, IBoom } from 'facile/interfaces';
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
            _configs: IConfigs;
            _listeners: IListenersMap;
            beforeEvents: any;
            afterEvents: any;
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
}

declare module 'facile/types/service' {
    import { IService, IFacile } from 'facile/interfaces';
    /**
        * Base Service Class
        *
        * @export
        * @class Service
        */
    export class Service implements IService {
            facile: IFacile;
            /**
                * Creates an instance of Service.
                *
                * @param {IFacile} facile
                *
                * @memberOf Service
                */
            constructor(facile: IFacile);
    }
}

declare module 'facile/types/filter' {
    import { IFilter, IFacile } from 'facile/interfaces';
    /**
        * Base Filter Class
        *
        * @export
        * @class Filter
        * @implements {IFilter}
        */
    export class Filter implements IFilter {
            facile: IFacile;
            /**
                * Creates an instance of Filter.
                *
                * @param {IFacile} facile
                *
                * @memberOf Filter
                */
            constructor(facile: IFacile);
    }
}

declare module 'facile/types/model' {
    import { IModel, IFacile } from 'facile/interfaces';
    /**
        * Base Model Class
        *
        * @export
        * @class Model
        */
    export class Model implements IModel {
            facile: IFacile;
            /**
                * Creates an instance of Model.
                *
                * @param {IFacile} facile
                *
                * @memberOf Model
                */
            constructor(facile: IFacile);
    }
}

declare module 'facile/types/controller' {
    import { IController, IFacile } from 'facile/interfaces';
    /**
        * Base Controller Class
        *
        * @export
        * @class Controller
        */
    export class Controller implements IController {
            facile: IFacile;
            /**
                * Creates an instance of Controller.
                *
                * @param {IFacile} facile
                *
                * @memberOf Controller
                */
            constructor(facile: IFacile);
    }
}

