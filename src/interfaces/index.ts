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

/**
 * IUtils
 *
 * @export
 * @interface IUtils
 */
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

/**
 * IInit
 *
 * @export
 * @interface IInit
 */
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

/**
 * IListenersMap
 *
 * @export
 * @interface IListenersMap
 */
export interface IListenersMap {
	[name: string]: { before: boolean, after: boolean };
}

/**
 * ICore
 *
 * @export
 * @class ICore
 * @interface
 * @extends {EventEmitter}
 */
export interface ICore extends EventEmitter {

	/**
	 * express
	 *
	 * @member {*} express
	 * @memberOf ICore
	 */
	express: any;

	/**
	 * app
	 *
	 * @member {Express} app
	 * @memberOf ICore
	 */
	app: Express;

	/**
	 * server
	 *
	 * @member {Server} server
	 * @memberOf ICore
	 */
	server: Server;

	/**
	 * log
	 *
	 * @member {LoggerInstance} log
	 * @memberOf ICore
	 */
	log: LoggerInstance;

	/**
	 * _errors
	 *
	 * @member {IErrors} _errors
	 * @memberOf ICore
	 */
	_errors: IErrors;

	/**
	 * _pkg
	 *
	 * @member {*} _pkg
	 * @memberOf ICore
	 */
	_pkg: any;

	/**
	 * _apppkg
	 *
	 * @member {*} _apppkg
	 * @memberOf ICore
	 */
	_apppkg: any;

	/**
	 * _config
	 *
	 * @member {IConfig} _config
	 * @memberOf ICore
	 */
	_config: IConfig;

	/**
	 * _configs
	 *
	 * @member {IConfigs} _configs
	 * @memberOf ICore
	 */
	_configs: IConfigs;

	/**
	 * _routers
	 *
	 * @member {IRouters} _routers
	 * @memberOf ICore
	 */
	_routers: IRouters;

	/**
	 * _middlewares
	 *
	 * @member {IMiddlewaresMap} _middlewares
	 * @memberOf ICore
	 */
	_middlewares: IMiddlewares;

	/**
	 * _services
	 *
	 * @member {*} _services
	 * @memberOf ICore
	 */
	_services: any;

	/**
	 * _filters
	 *
	 * @member {*} _filters
	 * @memberOf ICore
	 */
	_filters: any;

	/**
	 * _models
	 *
	 * @member {*} _models
	 * @memberOf ICore
	 */
	_models: any;

	/**
	 * _controllers
	 *
	 * @member {*} _controllers
	 * @memberOf ICore
	 */
	_controllers: any;

	/**
	 * _policies
	 *
	 * @member {*} _policies
	 * @memberOf ICore
	 */
	_policies: any;

	/**
	 * _routes
	 *
	 * @member {Array<IRoute>} _routes
	 * @memberOf ICore
	 */
	_routes: Array<IRoute>;

	/**
	 * _nextSocketId
	 *
	 * @member {number} _nextSocketId
	 * @memberOf ICore
	 */
	_nextSocketId: number;

	/**
	 * _sockets
	 *
	 * @member {ISockets} _sockets
	 * @memberOf ICore
	 */
	_sockets: ISockets;

	before(name: string, event: ICallback): ICore;
	after(name: string, event: ICallback): ICore;
	hasBefore(name: string): boolean;
	hasAfter(name: string): boolean;
	execBefore(name: string, fn?: ICallbackResult): void;
	execAfter(name: string, fn?: ICallbackResult): void;
	execEvents(name: string, type: string, fn?: ICallbackResult): void;

}

/**
 * IFacile
 *
 * @export
 * @class IFacile
 * @interface IFacile
 * @extends {ICore}
 */
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
	registerRoute(route: IRoute): IFacile;
	registerRoute(route: IRoute | IRoutes | IRoute[]): IFacile;

	registerPolicy(name: IPolicy): IFacile;
	registerPolicy(name: string, policy: IPolicy): IFacile;
	registerPolicy(name: string, action: string, policy: boolean): IFacile;
	registerPolicy(name: string, action: string, policy: string): IFacile;
	registerPolicy(name: string, action: string, policy: string[]): IFacile;
	registerPolicy(name: string, action: string, policy: IRequestHandler): IFacile;
	registerPolicy(name: string, action: string, policy: Array<IRequestHandler>): IFacile;

	registerPolicy(name: string | IPolicy,
								action?: string | boolean | string[] | IRequestHandler | Array<IRequestHandler> | IPolicy,
								policy?: string | boolean | string[] | IRequestHandler | Array<IRequestHandler>): IFacile;

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

	listRoutes(router: string): string[];

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
 * Express View Settings
 *
 * @export
 * @interface IExpressViews
 */
export interface IViewConfig {
	layout?: string;
	engine?: string | Function;
	extension?: string;
	views?: string | string[] | boolean;
}

export interface IDatabase {
	'module': any;		// The imported/required module.
	connection: any;	// The connected instance.
}

export interface IRoutesTemplateActions {
	find?: string;
	findOne?: string;
	create?: string;
	update?: string;
	destroy?: string;
}

/**
 * IRoutesTemplate
 *
 * @export
 * @interface IRoutesTemplate
 */
export interface IRoutesTemplate {
	controller: string;
	actions: IRoutesTemplateActions;
}

export interface IRoutesHandlers {
	index: string | IRequestHandler;
	view: string | IRequestHandler;
	redirect: string | IRequestHandler;
	security: string | IRequestHandler;
}

/**
 * IRoutesConfig
 *
 * @export
 * @interface IRoutesConfig
 */
export interface IRoutesConfig {
	handlers?: IRoutesHandlers;
	securityFilter?: string | IRequestHandler;
	rest?: IRoutesTemplate | boolean;
	crud?: IRoutesTemplate | boolean;
	sort?: boolean;
}

/**
 * Server Configuration.
 *
 * @export
 * @interface IConfig
 */
export interface IConfig {

	/**
	 * auto
	 *
	 * @desc enables auto init/configure.
	 * @member {boolean} auto
	 * @memberOf IConfig
	 */
	auto?: boolean;

	/**
	 * cwd
	 *
	 * @desc the current working directory.
	 * @member {string} cwd
	 * @memberOf IConfig
	 */
	cwd?: string;

	/**
	 * pkg
	 *
	 * @desc the app's package.json.
	 * @member {*} pkg
	 * @memberOf IConfig
	 */
	pkg?: any;

	/**
	 * host
	 *
	 * @desc the server's host address.
	 * @member {string} host
	 * @memberOf IConfig
	 */
	host?: string;

	/**
	 * port
	 *
	 * @desc the server's port.
	 * @member {number}
	 * @memberOf IConfig
	 */
	port?: number;

	/**
	 * certificate
	 *
	 * @desc the ssl certificate.
	 * @member {(ICertificate | boolean)} certificate
	 * @memberOf IConfig
	 */
	certificate?: ICertificate | true;

	/**
	 * maxConnections
	 *
	 * @desc the maximum simultaneous socket connections.
	 * @member {number} maxConnections
	 * @memberOf IConfig
	 */
	maxConnections?: number;

	/**
	 * env
	 *
	 * @desc the current working environment.
	 * @member {string} env
	 * @memberOf IConfig
	 */
	env?: string;

	/**
	 * logger
	 *
	 * @desc the default app's logger.
	 * @member {LoggerInstance} logger
	 * @memberOf IConfig
	 */
	logger?: LoggerInstance;

	/**
	 * logLevel
	 *
	 * @desc the log level to set the logger to.
	 * @member {('error' | 'warn' | 'info' | 'debug')} logLevel
	 * @memberOf IConfig
	 */
	logLevel?: 'error' | 'warn' | 'info' | 'debug';

	/**
	 * views
	 *
	 * @desc the server views configuration.
	 * @member {IViewConfig} views
	 * @memberOf IConfig
	 */
	views?: IViewConfig;

	/**
	 * routes
	 *
	 * @desc the config for generating routes.
	 * @member {IRoutesConfig} routes
	 * @memberOf IConfig
	 */
	routes?: IRoutesConfig;

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

/**
 * IMiddlewares
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
export interface IErrors {
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
	handler?: IRequestHandler | string;
	filters?: IRequestHandler | Array<IRequestHandler>;
	view?: string;
	redirect?: string;
	router?: string;
	model?: any;
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

/**
 * IPolicy
 *
 * @export
 * @interface IPolicy
 */
export interface IPolicy {
	[name: string]: boolean | string | string[] | IRequestHandler | Array<IRequestHandler> | IPolicies;
}

/**
 * IPolicies
 *
 * @export
 * @interface IPolicies
 */
export interface IPolicies {
	[name: string]: boolean | string | string[] | IRequestHandler | Array<IRequestHandler> | IPolicy;
}

/**
 * IComponent
 *
 * @desc base interfaces for components.
 * @export
 * @interface IComponent
 */
export interface IComponent {}

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
export interface IFilter extends IComponent {}

/**
 * IModel
 *
 * @desc interfaces for models.
 * @export
 * @interface IModel
 * @extends {IComponent}
 */
export interface IModel extends IComponent {}

/**
 * IController
 *
 * @desc interfaces for controllers.
 * @export
 * @interface IController
 * @extends {IComponent}
 */
export interface IController extends IComponent {}

/**
 * IService
 *
 * @desc interface for services.
 * @export
 * @interface IService
 * @extends {IComponent}
 */
export interface IService extends IComponent {}





