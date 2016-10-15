import { IFacile, IInit, IViewEngine, IMiddleware } from '../interfaces';
import { createServer } from 'http';
import { createServer as createServerHttps } from 'https';
import { each, sortBy, isString } from 'lodash';
import { red, cyan } from 'chalk';
import { Server, Socket } from 'net';
import * as cons from 'consolidate';
import { Facile } from './';

export function init(facile: Facile): any {

	return (fn?: Function): IInit => {

		function handleServer(): IInit {

			////////////////////////////////
			// Configure Views
			////////////////////////////////

			// Check if engine in config is string
			// or valid engine object.
			if (facile._config.views) {

				let viewConfig = facile._config.views;
				let eng = viewConfig.engine;

				// Convert engine to valid
				// consolidate rendering engine.
				if (isString(eng.renderer))
					eng.renderer = cons[eng.renderer];

				// Set the engine.
				facile._config.views.engine = eng;
				facile.app.engine(eng.name, eng.renderer as Function);

				// Set view engine.
				let viewEng = viewConfig['view engine'];
				viewEng = viewConfig['view engine'] = viewEng || eng.name;
				facile.app.set('view engine', viewEng);

				// Set views path.
				if (viewConfig.views)
					facile.app.set('views', viewConfig.views);

			}

			////////////////////////////////
			// Configure Middleware
			////////////////////////////////

			facile.log.debug('Initializing Server Middleware.');
			let middlewares = sortBy(facile._middlewares, 'order');
			each(middlewares, (v: IMiddleware) => {
				facile.app.use(v.fn);
			});

			////////////////////////////////
			// Server Protocol & Cert
			////////////////////////////////

			facile.log.debug('Initializing Server protocol.');
			if (facile._config.certificate)
				facile.server = createServerHttps(facile._config.certificate, facile.app);

			// Create Http Server.
			else
				facile.server = createServer(facile.app);

			// Limit server connections.
			facile.server.maxConnections = facile._config.maxConnections;

			////////////////////////////////
			// Listen for Connections
			////////////////////////////////

			facile.log.debug('Initializing Server connection listener.');
			facile.server.on('connection', (socket: Socket) => {

				// Save the connection.
				let socketId = facile._nextSocketId++;
				facile._sockets[socketId] = socket;

				// Listen for socket close.
				socket.on('close', () => {

					facile.log.debug('Socket ' + socketId + ' was closed.');
					delete facile._sockets[socketId];

				});

			});

			if (facile._config.auto)
				facile.execAfter('init:server', () => {
					facile.emit('init:services');
				});
			else if (fn)
				fn();
			else
				return facile.init();

	}

	if (facile._config.auto)
		facile.execBefore('init:server', () => {
			handleServer.call(facile);
		});
	else
		return handleServer.call(facile);

	};

}