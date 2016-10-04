import { Router, Handler, RequestHandler,
				NextFunction, ErrorRequestHandler,
				Request, Response } from 'express';
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

