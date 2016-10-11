import { EventEmitter }from 'events';
import { Router, RequestHandler,
				NextFunction, ErrorRequestHandler,
				Request, Response, Express } from 'express';
import { Socket, Server } from 'net';
import { BoomError, Output } from 'boom';
import { LoggerInstance } from 'winston';


// Re-export Interfaces for Convenience.
export interface IRequestHandler extends RequestHandler {}
export interface INextFunction extends NextFunction {}
export interface IErrorRequestHandler extends ErrorRequestHandler {}
export interface IRequest extends Request {}
export interface IResponse extends Response {}
export interface IBoomError extends BoomError {}
export interface IBoomOutput extends Output  {}

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
	done(): IFacile;
}

export interface IListenersMap {
	[name: string]: { before: boolean, after: boolean };
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
	_inits: IInit;
	_listeners: IListenersMap;
	_beforeEvents: any;
	_afterEvents: any;
	_configured: boolean;
	_initialized: boolean;
	_started: boolean;
	_autoInit: boolean;
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
	initAll(): IFacile;
	enableListeners(): IFacile;
	listen(): void;
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
	addRoute(method: string | string[] | IRoutesMap | IRoute[],
					url?: string,
					handler?: IRequestHandler,
					filters?: IRequestHandler | IRequestHandler[],
					router?: string): IFacile;
	router(name: string): Router;
	config(name: string): IConfig;
	filter(name: string): IFilter;
	service(name: string): IService;
	model(name: string): IModel;
	controller(name: string): IController;
	extend(...args: any[]): any;
	extendConfig(...configs: any[]): IConfig;

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
	//
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
