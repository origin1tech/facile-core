import { IFacile, IInit, IViewEngine, IMiddleware } from '../interfaces';
import { createServer } from 'http';
import { createServer as createServerHttps } from 'https';
import { each, sortBy, isString } from 'lodash';
import { red, cyan } from 'chalk';
import { Server, Socket } from 'net';
import * as cons from 'consolidate';

/**
 * Initializes Server
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
export function init(fn?: Function): IInit {

	function handleServer(): IInit {

		////////////////////////////////
		// Ensure Router.
		////////////////////////////////

		this.logger.debug('Initializing Server Router.');
		this._routers = this._routers || {};
		if (!this._routers['default'])
			this._routers['default'] = this.app._router;

		////////////////////////////////
		// Configure Views
		////////////////////////////////

		// Check if engine in config is string
		// or valid engine object.
		if (this._config.views) {

			let viewConfig = this._config.views;
			let eng = viewConfig.engine;

			// Convert engine to valid
			// consolidate rendering engine.
			if (isString(eng.renderer))
				eng.renderer = cons[eng.renderer];

			// Set the engine.
			this._config.views.engine = eng;
			this.app.engine(eng.name, eng.renderer as Function);

			// Set view engine.
			let viewEng = viewConfig['view engine'];
			viewEng = viewConfig['view engine'] = viewEng || eng.name;
			this.app.set('view engine', viewEng);

			// Set views path.
			if (viewConfig.views)
				this.app.set('views', viewConfig.views);

		}

		////////////////////////////////
		// Configure Middleware
		////////////////////////////////

		this.logger.debug('Initializing Server Middleware.');
		let middlewares = sortBy(this._middlewares, 'order');
		each(middlewares, (v: IMiddleware) => {
			this.app.use(v.fn);
		});

		////////////////////////////////
		// Server Protocol & Cert
		////////////////////////////////

		this.logger.debug('Initializing Server protocol.');
		if (this._config.certificate)
			this.server = createServerHttps(this._config.certificate, this.app);

		// Create Http Server.
		else
			this.server = createServer(this.app);

		// Limit server connections.
		this.server.maxConnections = this._config.maxConnections;

		////////////////////////////////
		// Listen for Connections
		////////////////////////////////

		this.logger.debug('Initializing Server connection listener.');
		this.server.on('connection', (socket: Socket) => {

			// Save the connection.
			let socketId = this._nextSocketId++;
			this._sockets[socketId] = socket;

			// Listen for socket close.
			socket.on('close', () => {

				this.logger.debug('Socket ' + socketId + ' was closed.');
				delete this._sockets[socketId];

			});

		});

		if (this._config.auto) {
			console.log('hit auto')
			this.execAfter('init:server', () => {
				this.emit('init:services');
			});
		}
		else if (fn)
			fn();
		else {
			console.log('hit here.')
			return this._inits;
		}

	}

	if (this._config.auto)
		this.execBefore('init:server', () => {
			handleServer.call(this);
		});
	else
		return handleServer.call(this);

}