"use strict";
var http_1 = require('http');
var https_1 = require('https');
var lodash_1 = require('lodash');
var cons = require('consolidate');
/**
 * Initializes Server
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
function init(fn) {
    var _this = this;
    function handleServer() {
        ////////////////////////////////
        // Ensure Router.
        ////////////////////////////////
        var _this = this;
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
            var viewConfig = this._config.views;
            var eng = viewConfig.engine;
            // Convert engine to valid
            // consolidate rendering engine.
            if (lodash_1.isString(eng.renderer))
                eng.renderer = cons[eng.renderer];
            // Set the engine.
            this._config.views.engine = eng;
            this.app.engine(eng.name, eng.renderer);
            // Set view engine.
            var viewEng = viewConfig['view engine'];
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
        var middlewares = lodash_1.sortBy(this._middlewares, 'order');
        lodash_1.each(middlewares, function (v) {
            _this.app.use(v.fn);
        });
        ////////////////////////////////
        // Server Protocol & Cert
        ////////////////////////////////
        this.logger.debug('Initializing Server protocol.');
        if (this._config.certificate)
            this.server = https_1.createServer(this._config.certificate, this.app);
        else
            this.server = http_1.createServer(this.app);
        // Limit server connections.
        this.server.maxConnections = this._config.maxConnections;
        ////////////////////////////////
        // Listen for Connections
        ////////////////////////////////
        this.logger.debug('Initializing Server connection listener.');
        this.server.on('connection', function (socket) {
            // Save the connection.
            var socketId = _this._nextSocketId++;
            _this._sockets[socketId] = socket;
            // Listen for socket close.
            socket.on('close', function () {
                _this.logger.debug('Socket ' + socketId + ' was closed.');
                delete _this._sockets[socketId];
            });
        });
        if (this._config.auto) {
            console.log('hit auto');
            this.execAfter('init:server', function () {
                _this.emit('init:services');
            });
        }
        else if (fn)
            fn();
        else {
            console.log('hit here.');
            return this._inits;
        }
    }
    if (this._config.auto)
        this.execBefore('init:server', function () {
            handleServer.call(_this);
        });
    else
        return handleServer.call(this);
}
exports.init = init;
//# sourceMappingURL=server.js.map