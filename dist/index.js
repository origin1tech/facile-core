"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// Import Dependencies.
var events = require('events');
var path_1 = require('path');
var express = require('express');
var Boom = require('boom');
var winston_1 = require('winston');
var http_1 = require('http');
var https_1 = require('https');
var lodash_1 = require('lodash');
var chalk_1 = require('chalk');
// Export Interfaces.
// export * from './interfaces';
// // Export Classes
// export * from './controller';
// export * from './model';
var defaults = {
    cwd: process.cwd(),
    pkg: require(path_1.join(process.cwd(), 'package.json')),
    env: 'development',
    logLevel: 'info',
    host: '127.0.0.1',
    port: 3000,
    maxConnections: 128
};
/**
 * RecRent
 *
 * @class RecRent
 */
var Facile = (function (_super) {
    __extends(Facile, _super);
    /**
     * Creates an instance of RecRent.
     *
     * @memberOf Facile
     */
    function Facile() {
        // Extend class with emitter.
        _super.call(this);
        this.nextSocketId = 0;
        // Create the default logger.
        var defaultLogger = new winston_1.Logger({
            level: 'info',
            transports: [
                new (winston_1.transports.Console)({
                    prettyPrint: true,
                    handleExceptions: true,
                    humanReadableUnhandledException: true
                }),
                new (winston_1.transports.File)({
                    filename: 'logs/' + this.config.pkg.name + '.log',
                    handleExceptions: true,
                    humanReadableUnhandledException: true
                })
            ]
        });
        // Add default logger to map 
        // and set as "log" instance.
        this.loggers['default'] = this.log = defaultLogger;
        this.log.debug('Creating Express instance.');
        // Create Express app.
        this.app = express();
        return this;
    }
    ///////////////////////////////////////////////////
    // CONFIGURE & MANAGE SERVER
    ///////////////////////////////////////////////////
    Facile.prototype.configure = function (config) {
        // Extend options with defaults.
        this.config = lodash_1.extend({}, defaults, config);
        // Setup the Logger.
        var logger;
        // Ensure we have a logger if
        // not then create default logger.
        logger = this.config.logger || { 'default': this.log };
        // Create a temp logger variable to
        // test if is LoggerInstance.
        var tmpLogger = logger;
        // If is loggerInstance define
        // as default logger.
        if ((tmpLogger instanceof winston_1.Logger))
            this.loggers = { 'default': tmpLogger };
        else
            this.loggers = logger;
        // Set log to default logger.
        this.log = this.loggers['default'];
        this.log.debug('Defining Boom error handlers.');
        // Expose common Boom events to framework.
        this.Boom = {
            wrap: Boom.wrap,
            create: Boom.create,
            badRequest: Boom.badRequest,
            unauthorized: Boom.unauthorized,
            forbidden: Boom.forbidden,
            notFound: Boom.notFound,
            notImplemented: Boom.notImplemented,
            badGateway: Boom.badGateway
        };
        this.log.debug('Defining node environment.');
        // Ensure environment.
        this.config.env = this.config.env || 'development';
        // Set Node environment.
        process.env.NODE_ENV = this.config.env;
        return this;
    };
    /**
     * Starts server listening for connections.
     *
     *
     * @memberOf Facile
     */
    Facile.prototype.listen = function () {
        this.server.listen(this.config.port, this.config.host, function (err) {
            if (err)
                throw err;
        });
    };
    /**
     * Start Server.
     *
     * @param {Function} [fn]
     *
     * @memberOf Facile
     */
    Facile.prototype.start = function (fn) {
        var _this = this;
        // Ensure Routers exist.
        this.routers = this.routers || {};
        // Check for default router.
        if (!this.routers['default'])
            this.routers['default'] = this.app._router;
        // Create Https if Certificate.
        if (this.config.certificate)
            this.server = https_1.createServer(this.config.certificate, this.app);
        else
            this.server = http_1.createServer(this.app);
        // Limit server connections.
        this.server.maxConnections = this.config.maxConnections;
        // Listener callback on server listening.
        this.server.on('listening', function () {
            var address = _this.server.address(), addy = address.address, port = address.port;
            console.log(chalk_1.cyan('\nServer listening at: http://' + addy + ':' + port));
            // Call if callack function provided.
            if (fn)
                fn(_this);
        });
        // Store connections
        this.server.on('connection', function (socket) {
            // Save the connection.
            var socketId = _this.nextSocketId++;
            _this.sockets[socketId] = socket;
            // Listen for socket close.
            socket.on('close', function () {
                _this.log.debug('Socket ' + socketId + ' was closed.');
                delete _this.sockets[socketId];
            });
        });
        // If build function call before
        // server listen.
        if (this.config.build)
            this.config.build(this, function (err) {
                // If error don't start server.
                if (err !== undefined) {
                    if (typeof err === 'string')
                        err = new Error(err);
                    throw err;
                }
                // All clear fire up server.
                _this.listen();
            });
        else
            this.listen();
        return this;
    };
    /**
     * Stops the server.
     *
     * @param {string} [msg]
     * @param {number} [code]
     * @returns {void}
     *
     * @memberOf Facile
     */
    Facile.prototype.stop = function (msg, code) {
        var _this = this;
        if (!this.server) {
            return;
        }
        // Closing sockets.
        var socketKeys = Object.keys(this.sockets);
        this.log.debug('Closing active (' + socketKeys.length + ') socket connections.');
        socketKeys.forEach(function (id) {
            var socket = _this.sockets[id];
            if (socket)
                socket.destroy();
        });
        // Close the server.
        this.log.debug('Closing server.');
        this.server.close(function () {
            console.log(chalk_1.cyan('\nServer successfully closed.'));
        });
    };
    ///////////////////////////////////////////////////
    // REGISTERING RESOURCES
    ///////////////////////////////////////////////////
    /**
     * Adds/Creates a Router.
     *
     * @param {string} name
     * @param {express.Router} [router]
     * @returns {express.Router}
     *
     * @memberOf Facile
     */
    Facile.prototype.addRouter = function (name, router) {
        // Check for default router.
        if (name === 'default')
            throw new Error('Router name cannot be "default".');
        // Check if router is supplied.
        if (!router)
            router = express.Router();
        // Add router to map.
        this.routers[name] = router;
        return router;
    };
    /**
     * Registers middleware with Express.
     *
     * @param {string} name
     * @param {Function} fn
     * @param {number} [order]
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addMiddleware = function (name, fn, order) {
        // Get max orer id.
        var max = lodash_1.maxBy(this.middlewares, 'order').order;
        // The orderId is essentially
        // the sort order.
        var orderId = order !== undefined ? order : (max += 1);
        if (this.middlewares[orderId]) {
        }
        // Define the middleware.
        var middleware = {
            fn: fn,
            order: order
        };
        return this;
    };
    /**
     * Registers a filter.
     *
     * @param {string} name
     * @param {Function} fn
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addFilter = function (name, fn) {
        return this;
    };
    /**
     * Adds Model to map.
     *
     * @param {string} name
     * @param {IModel} model
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addModel = function (name, model) {
        this.models[name] = model;
        return this;
    };
    /**
     * Adds Controller to map.
     *
     * @param {string} name
     * @param {IController} controller
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addController = function (name, controller) {
        this.controllers[name] = controller;
        return this;
    };
    /**
     * Adds a route to the map.
     *
     * @param {(string | IRoute)} method
     * @param {string} url
     * @param {(express.Handler | Array<express.Handler>)} handlers
     * @param {string} [router]
     * @returns {RecRent}
     *
     * @memberOf Facile
     */
    Facile.prototype.addRoute = function (method, url, handlers, router) {
        var route;
        // Check if method is IRoute object.
        // MUST use "as" to tell typescript
        // to use that type.
        if (lodash_1.isPlainObject(method)) {
            route = method;
        }
        else {
            var _method = void 0;
            if (Array.isArray(method))
                _method = method;
            else
                _method = method;
            route = {
                router: router || 'default',
                method: _method,
                url: url,
                handlers: handlers
            };
        }
        // Add the Route.
        this.routes.push(route);
        return this;
    };
    /**
     * Adds an array of IRoutes.
     *
     * @param {Array<IRoute>} routes
     *
     * @memberOf Facile
     */
    Facile.prototype.addRoutes = function (routes) {
        var _this = this;
        routes.forEach(function (r) {
            _this.addRoute(r);
        });
        return this;
    };
    /**
     * Adds routes using route map.
     *
     * @param {(string | IRoutesMap)} router
     * @param {IRoutesMap} [routes]
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addRoutesMap = function (router, routes) {
        return this;
    };
    ///////////////////////////////////////////////////
    // INSTANCE HELPERS
    ///////////////////////////////////////////////////
    /**
     * Returns a Logger my name.
     *
     * @param {string} name
     * @returns {LoggerInstance}
     *
     * @memberOf Facile
     */
    Facile.prototype.logger = function (name) {
        return this.loggers[name];
    };
    /**
     * Gets a Filter by name.
     *
     * @param {string} name
     * @returns {IFilter}
     *
     * @memberOf Facile
     */
    Facile.prototype.filter = function (name) {
        return this.filters[name];
    };
    /**
     * Gets a Model by name.
     *
     * @param {string} name
     * @returns {IModel}
     *
     * @memberOf Facile
     */
    Facile.prototype.model = function (name) {
        return this.models[name];
    };
    /**
     * Gets a controller by name.
     *
     * @param {string} name
     * @returns {IController}
     *
     * @memberOf Facile
     */
    Facile.prototype.controller = function (name) {
        return this.controllers[name];
    };
    return Facile;
}(events.EventEmitter));
exports.Facile = Facile;
//# sourceMappingURL=index.js.map