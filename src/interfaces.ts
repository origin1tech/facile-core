import { Router, Handler, RequestHandler,
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

export interface IFacile {

	Boom: IBoom;
	loggers: ILoggers;
	log: LoggerInstance;
	config: IConfig;
	app: Express;
	server: Server;
	routers: IRouters;
	routes: Array<IRoute>;

	nextSocketId: number;
	sockets: ISockets;

	middlewares: IMiddlewares;
	filters: IFilters;
	models: IModels;
	controllers: IControllers;

	configure(config?: IConfig): IFacile;
	start(fn?: Function): IFacile;
	stop(msg?: string, code?: number): void;

	addRouter(name: string, router?: Router): Router;
	addMiddleware(name: string, fn: Function, order?: number): IFacile;
	addFilter(name: string, fn: Function): IFacile;
	addRoute(method: string | IRoute | Array<string>, url?: string,
					handlers?: Handler | Array<Handler>,
					router?: string): IFacile;
	addRoutes(routes: Array<IRoute>): IFacile;
	addRoutesMap(router: string | IRoutesMap, routes?: IRoutesMap): IFacile;

	filter(name: string): IFilter;
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
	logger?: LoggerInstance | ILoggers;
	logLevel?: 'info',
	build?(facile: IFacile, fn: ICallback);
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
	fn: Function;
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

/**
 * Interface for Filter.
 *
 * @export
 * @interface IFilter
 */
export interface IFilter {

}

/**
 * Map of IFilters
 *
 * @export
 * @interface IFilters
 */
export interface IFilters {
	[name: string]: IFilters;
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



