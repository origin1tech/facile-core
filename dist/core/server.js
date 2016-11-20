"use strict";
var http_1 = require('http');
var https_1 = require('https');
var httpext = require('./httpext');
var lodash_1 = require('lodash');
var cons = require('consolidate');
function init(facile) {
    return function (fn) {
        function handleServer() {
            ////////////////////////////////
            // Configure Views
            ////////////////////////////////
            // Check if engine in config is string
            // or valid engine object.
            if (facile._config.views) {
                var viewConfig = facile._config.views;
                var renderer = viewConfig.engine;
                var ext = viewConfig.extension;
                if (!ext && lodash_1.isString(renderer))
                    ext = renderer;
                // Normalize the extension.
                ext = ext || 'ejs';
                ext = ext.replace(/^\./, '');
                // Convert engine to valid
                // consolidate rendering engine.
                if (lodash_1.isString(renderer))
                    renderer = cons[renderer];
                if (!lodash_1.isFunction(renderer)) {
                    facile.log.error('Failed to resolve view rendering engine...exiting.');
                    process.exit();
                }
                // Set the engine.
                facile.app.engine(ext, renderer);
                // Set view engine.
                facile.app.set('view engine', ext);
                // Set views path.
                if (viewConfig.views)
                    facile.app.set('views', viewConfig.views);
            }
            ////////////////////////////////
            // Configure Response
            ////////////////////////////////
            // Extend with Boom errors.
            facile.app.use(httpext.response(this));
            ////////////////////////////////
            // Configure Middleware
            ////////////////////////////////
            facile.log.debug('Initializing Server Middleware.');
            var middlewares = lodash_1.sortBy(facile._middlewares, 'order');
            lodash_1.each(middlewares, function (v) {
                facile.app.use(v.fn);
            });
            ////////////////////////////////
            // Server Protocol & Cert
            ////////////////////////////////
            facile.log.debug('Initializing Server protocol.');
            if (facile._config.certificate)
                facile.server = https_1.createServer(facile._config.certificate, facile.app);
            else
                facile.server = http_1.createServer(facile.app);
            // Limit server connections.
            facile.server.maxConnections = facile._config.maxConnections;
            ////////////////////////////////
            // Listen for Connections
            ////////////////////////////////
            facile.log.debug('Initializing Server connection listener.');
            facile.server.on('connection', function (socket) {
                // Save the connection.
                var socketId = facile._nextSocketId++;
                facile._sockets[socketId] = socket;
                // Listen for socket close.
                socket.on('close', function () {
                    facile.log.debug('Socket ' + socketId + ' was closed.');
                    delete facile._sockets[socketId];
                });
            });
            if (facile._config.auto)
                facile.execAfter('init:server', function () {
                    facile.emit('init:services');
                });
            else if (fn)
                fn();
            else
                return facile.init();
        }
        if (facile._config.auto)
            facile.execBefore('init:server', function () {
                handleServer.call(facile);
            });
        else
            return handleServer.call(facile);
    };
}
exports.init = init;
//# sourceMappingURL=server.js.map