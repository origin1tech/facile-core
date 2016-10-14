/// <reference types="node" />
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
    run(): void;
    server(): IInit;
    services(): IInit;
    filters(): IInit;
    models(): IInit;
    controllers(): IInit;
    routes(): IInit;
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
    _routers: IRouters;
    _routes: Array<IRoute>;
    _middlewares: any;
    _services: any;
    _filters: any;
    _models: any;
    _controllers: any;
    _policies: any;
    _nextSocketId: number;
    _sockets: ISockets;
    before(name: string, event: ICallback): ICore;
    after(name: string, event: ICallback): ICore;
    hasBefore(name: string): boolean;
    hasAfter(name: string): boolean;
    execBefore(name: string, fn?: ICallbackResult): void;
    execAfter(name: string, fn?: ICallbackResult): void;
    execEvents(name: string, type: string, fn?: ICallbackResult): void;
}
export interface IFacile extends ICore {
    configure(config?: string | IConfig): IFacile;
    init(): IInit;
    start(config?: string | IConfig | Function, fn?: Function): IFacile;
    stop(msg?: string, code?: number): void;
    registerConfig(name: string, ...extend: any[]): IFacile;
    registerConfig(configs: IConfigs, ...extend: any[]): IFacile;
    registerConfig(name: string, config: IConfig): IFacile;
    registerMiddleware(middlewares: IMiddlewares): IFacile;
    registerMiddleware(name: string, fn: IRequestHandler, order?: number): IFacile;
    registerMiddleware(name: string, fn: IErrorRequestHandler, order?: number): IFacile;
    registerMiddleware(name: string | IMiddlewares, fn?: IRequestHandler | IErrorRequestHandler, order?: number): IFacile;
    registerRoute(routes: IRoutes): IFacile;
    registerRoute(routes: Array<IRoute>): IFacile;
    registerRoute(route: IRoute | IRoutes | IRoute[]): IFacile;
    registerPolicy(name: IPolicies): IFacile;
    registerPolicy(name: string, policy: boolean): IFacile;
    registerPolicy(name: string, policy: string): IFacile;
    registerPolicy(name: string, policy: string[]): IFacile;
    registerPolicy(name: string, policy: IRequestHandler): IFacile;
    registerPolicy(name: string, policy: Array<IRequestHandler>): IFacile;
    registerPolicy(name: string, policy: IPolicies): IFacile;
    registerPolicy(name: string, action: string, policy: boolean): IFacile;
    registerPolicy(name: string, action: string, policy: string): IFacile;
    registerPolicy(name: string, action: string, policy: string[]): IFacile;
    registerPolicy(name: string, action: string, policy: IRequestHandler): IFacile;
    registerPolicy(name: string, action: string, policy: Array<IRequestHandler>): IFacile;
    registerPolicy(name: string, action: string, policy: IPolicies): IFacile;
    registerPolicy(name: string | IPolicies, action?: string | boolean | string[] | IRequestHandler | Array<IRequestHandler> | IPolicies, policy?: string | boolean | string[] | IRequestHandler | Array<IRequestHandler> | IPolicies): IFacile;
    registerComponent(Component: IComponent): IFacile;
    registerComponent(components: IComponents): IFacile;
    registerComponent(name: string, Component: IComponent): IFacile;
    registerComponent(name: string | IComponent | IComponents, Component?: IComponent): IFacile;
    router(name: string, options?: any): Router;
    config(name: string): IConfig;
    filter<T>(name: string): T;
    service<T>(name: string): T;
    model<T>(name: string): T;
    controller<T>(name: string): T;
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
export interface IDatabase {
    'module': any;
    connection: any;
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
    database?: IDatabase;
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
    fn: IRequestHandler | IErrorRequestHandler;
    order?: number;
}
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
export interface IRoutes {
    [url: string]: IRequestHandler | Array<IRequestHandler> | string | IRoute;
}
export interface IPolicy {
    [name: string]: boolean | string | string[] | IRequestHandler | Array<IRequestHandler> | IPolicies;
}
export interface IPolicies {
    [name: string]: IPolicy;
}
/**
 * IComponent
 *
 * @desc base interfaces for components.
 * @export
 * @interface IComponent
 */
export interface IComponent {
}
/**
 * IComponentsMap
 *
 * @desc key value map of IComponents.
 * @export
 * @interface IComponentsMap
 */
export interface IComponents {
    [name: string]: IComponent;
}
/**
 * IFilter
 *
 * @desc interfaces for filters.
 * @export
 * @interface IFilter
 * @extends {IComponent}
 */
export interface IFilter extends IComponent {
}
/**
 * IModel
 *
 * @desc interfaces for models.
 * @export
 * @interface IModel
 * @extends {IComponent}
 */
export interface IModel extends IComponent {
}
/**
 * IController
 *
 * @desc interfaces for controllers.
 * @export
 * @interface IController
 * @extends {IComponent}
 */
export interface IController extends IComponent {
}
/**
 * IService
 *
 * @desc interface for services.
 * @export
 * @interface IService
 * @extends {IComponent}
 */
export interface IService extends IComponent {
}
