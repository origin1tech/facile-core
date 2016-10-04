// Generated by dts-bundle v0.6.0
// Dependencies for this module:
//   ../events
//   ../express
//   ../net
//   ../boom
//   ../winston

declare module 'facile' {
    import * as events from 'events';
    import * as express from 'express';
    import { Server } from 'net';
    import { IConfig, IRouters, IRoute, IRoutesMap, IBoom, ILoggers } from 'facile/interfaces';
    /**
        * RecRent
        *
        * @class RecRent
        */
    export class Facile extends events.EventEmitter {
            Boom: IBoom;
            loggers: ILoggers;
            flags: any;
            config: IConfig;
            app: express.Express;
            server: Server;
            routers: IRouters;
            routes: Array<IRoute>;
            /**
                * Creates an instance of RecRent.
                *
                * @memberOf RecRent
                */
            constructor();
            configure(config?: IConfig): Facile;
            /**
                * Adds/Creates a Router.
                *
                * @param {string} name
                * @param {express.Router} [router]
                * @returns {express.Router}
                *
                * @memberOf RecRent
                */
            addRouter(name: string, router?: express.Router): express.Router;
            /**
                * Adds a route to the map.
                *
                * @param {(string | IRoute)} method
                * @param {string} url
                * @param {(express.Handler | Array<express.Handler>)} handlers
                * @param {string} [router]
                * @returns {RecRent}
                *
                * @memberOf RecRent
                */
            addRoute(method: string | IRoute | Array<string>, url?: string, handlers?: express.Handler | Array<express.Handler>, router?: string): Facile;
            /**
                * Adds an array of IRoutes.
                *
                * @param {Array<IRoute>} routes
                *
                * @memberOf Framework
                */
            addRoutes(routes: Array<IRoute>): void;
            addRoutesMap(router: string | IRoutesMap, routes?: IRoutesMap): void;
            /**
                * Start Server.
                *
                * @param {Function} [fn]
                *
                * @memberOf RecRent
                */
            start(fn?: Function): Facile;
            /**
                * Stops the server.
                *
                * @param {string} [msg]
                * @param {number} [code]
                * @returns {void}
                *
                * @memberOf Framework
                */
            stop(msg?: string, code?: number): void;
    }
}

declare module 'facile/interfaces' {
    import { Router, Handler, RequestHandler, NextFunction, ErrorRequestHandler, Request, Response } from 'express';
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
        * Server Options.
        *
        * @export
        * @interface IOptions
        */
    export interface IConfig {
            cwd?: string;
            pkg?: any;
            host?: string;
            port?: number;
            certificate?: ICertificate | true;
            env?: string;
            logger?: LoggerInstance | ILoggers;
    }
    export interface IFlags {
            [name: string]: any;
    }
    /**
        * Map of Loggers implementation.
        *
        * @export
        * @interface ILoggers
        */
    export interface ILoggers {
            [name: string]: LoggerInstance;
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
            router?: string;
            controller?: string;
            method?: string | Array<string>;
            url: string | Array<string>;
            handlers: Handler | Array<Handler>;
    }
    /**
        * Interface for creating routes
        * using a map
        *
        * 'post /api/user': [ some handler ]
        *
        * @export
        * @interface IRoutesMap
        */
    export interface IRoutesMap {
            [url: string]: Handler | Array<Handler>;
    }
}
