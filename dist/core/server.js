"use strict";
var http_1 = require('http');
var https_1 = require('https');
var lodash_1 = require('lodash');
var cons = require('consolidate');
/**
 * Initializes Server
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    function handleServer() {
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
            var viewConfig = that._config.views;
            var eng = viewConfig.engine;
            // Convert engine to valid
            // consolidate rendering engine.
            if (lodash_1.isString(eng.renderer))
                eng.renderer = cons[eng.renderer];
            // Set the engine.
            that._config.views.engine = eng;
            that.app.engine(eng.name, eng.renderer);
            // Set view engine.
            var viewEng = viewConfig['view engine'];
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
        var middlewares = lodash_1.sortBy(that._middlewares, 'order');
        lodash_1.each(middlewares, function (v) {
            that.app.use(v.fn);
        });
        ////////////////////////////////
        // Server Protocol & Cert
        ////////////////////////////////
        that.logger.debug('Initializing Server protocol.');
        if (that._config.certificate)
            that.server = https_1.createServer(that._config.certificate, that.app);
        else
            that.server = http_1.createServer(that.app);
        // Limit server connections.
        that.server.maxConnections = that._config.maxConnections;
        ////////////////////////////////
        // Listen for Connections
        ////////////////////////////////
        that.logger.debug('Initializing Server connection listener.');
        that.server.on('connection', function (socket) {
            // Save the connection.
            var socketId = that._nextSocketId++;
            that._sockets[socketId] = socket;
            // Listen for socket close.
            socket.on('close', function () {
                that.logger.debug('Socket ' + socketId + ' was closed.');
                delete that._sockets[socketId];
            });
        });
        if (that._config.auto)
            that.execAfter('init:server', function () {
                that.emit('init:services');
            });
        else
            return that.init();
    }
    if (that._config.auto)
        that.execBefore('init:server', function () {
            handleServer();
        });
    else
        return handleServer();
}
exports.init = init;
//# sourceMappingURL=server.js.map