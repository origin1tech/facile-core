/// <reference types="node" />
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
    noop(): void;
}
export interface IFacile {
    _pkg: any;
    Boom: IBoom;
    logger: LoggerInstance;
    app: Express;
    server: Server;
    _config: IConfig;
    _routers: IRouters;
    _routes: Array<IRoute>;
    _nextSocketId: number;
    _sockets: ISockets;
    _middlewares: IMiddlewares;
    _filters: IFilters;
    _models: IModels;
    _controllers: IControllers;
    configure(config?: IConfig | boolean, autoStart?: boolean | ICallback, fn?: ICallback): IFacile | void;
    load(autoStart?: boolean, fn?: ICallback): IFacile | void;
    start(fn?: ICallback): void;
    stop(msg?: string, code?: number): void;
    addConfig(name: string, config: IConfig): IFacile;
    addRouter(name: string, router?: Router): Router;
    addMiddleware(name: string, fn: Function, order?: number): IFacile;
    addService(Service: IService | Array<IService>): IFacile;
    addFilter(Filter: IFilter | Array<IFilter>): IFacile;
    addModel(Model: IModel | Array<IModel>): IFacile;
    addController(Controller: IController | Array<IController>): IFacile;
    addService(Service: IService | Array<IService>, instance?: boolean): IFacile;
    addRoute(method: string | IRoute | Array<string>, url?: string, handlers?: IRequestHandler | Array<IRequestHandler>, router?: string): IFacile;
    config(name: string): IConfig;
    filter(name: string): IFilter;
    service(name: string): IService;
    model(name: string): IModel;
    controller(name: string): IController;
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
export interface ICallback {
    (err?: string | Error, data?: any): void;
}
/**
 * Express View Settings
 *
 * @export
 * @interface IExpressViews
 */
export interface IExpressViews {
    engine: string;
    'view engine': string;
    views: string | string[];
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
    views?: IExpressViews;
    database?: any;
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
    fn: IRequestHandler;
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
    router?: string;
    method?: string | Array<string>;
    url: string | Array<string>;
    handlers: IRequestHandler | Array<IRequestHandler>;
}
/**
 * Interface for Routes by Map.
 *
 * @export
 * @interface IRoutesMap
 */
export interface IRoutesMap {
    [url: string]: IRequestHandler | Array<IRequestHandler>;
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
