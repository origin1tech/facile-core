import { IFacile, IInit, IViewEngine } from '../interfaces';
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
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	function handleServer(): IInit {

		////////////////////////////////
		// Ensure Router.
		////////////////////////////////

		that.logger.debug('Initializing Server Router.');
		that._routers = that._routers || {};
		if (!that._routers['default'])
			that._routers['default'] = that.app._router;

		////////////////////////////////
		// Configure Views
		////////////////////////////////

		// Check if engine in config is string
		// or valid engine object.
		if (that._config.views) {

			let viewConfig = that._config.views;
			let eng = viewConfig.engine;

			// Convert engine to valid
			// consolidate rendering engine.
			if (isString(eng.renderer))
				eng.renderer = cons[eng.renderer];

			// Set the engine.
			that._config.views.engine = eng;
			that.app.engine(eng.name, eng.renderer as Function);

			// Set view engine.
			let viewEng = viewConfig['view engine'];
			viewEng = viewConfig['view engine'] = viewEng || eng.name;
			that.app.set('view engine', viewEng);

			// Set views path.
			if (viewConfig.views)
				that.app.set('views', viewConfig.views);

		}

		////////////////////////////////
		// Configure Middleware
		////////////////////////////////

		that.logger.debug('Initializing Server Middleware.');
		let middlewares = sortBy(that._middlewares, 'order');
		each(middlewares, (v) => {
			that.app.use(v.fn);
		});

		////////////////////////////////
		// Server Protocol & Cert
		////////////////////////////////

		that.logger.debug('Initializing Server protocol.');
		if (that._config.certificate)
			that.server = createServerHttps(that._config.certificate, that.app);

		// Create Http Server.
		else
			that.server = createServer(that.app);

		// Limit server connections.
		that.server.maxConnections = that._config.maxConnections;

		////////////////////////////////
		// Listen for Connections
		////////////////////////////////

		that.logger.debug('Initializing Server connection listener.');
		that.server.on('connection', (socket: Socket) => {

			// Save the connection.
			let socketId = that._nextSocketId++;
			that._sockets[socketId] = socket;

			// Listen for socket close.
			socket.on('close', () => {

				that.logger.debug('Socket ' + socketId + ' was closed.');
				delete that._sockets[socketId];

			});

		});

		if (that._config.auto)
			that.execAfter('init:server', () => {
				that.emit('init:services');
			});
		else
			return that.init();

	}

	if (that._config.auto)
		that.execBefore('init:server', () => {
			handleServer();
		});
	else
		return handleServer();

}