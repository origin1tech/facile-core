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
var utils_1 = require('./utils');
// Export Interfaces.
// export * from './interfaces';
// // Export Classes
// export * from './controller';
// export * from './model';
var defaults = {
    cwd: process.cwd(),
    pkg: require(path_1.join(process.cwd(), 'package.json')),
    host: '127.0.0.1',
    port: 3000,
    env: 'development'
};
// let routes = this.routes.filter((r: IRoute) => {
// 	return r.router === router;
// });
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
     * @memberOf RecRent
     */
    function Facile() {
        // Extend class with emitter.
        _super.call(this);
        // Parse flags.
        this.flags = utils_1.parseFlags();
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
        // Create Express app.
        this.app = express();
        console.log('Facile initialized.');
        return this;
    }
    Facile.prototype.configure = function (config) {
        // Extend options with defaults.
        // Pass flags as last arg to allow
        // overwriting from command line.
        this.config = lodash_1.extend({}, defaults, config, this.flags);
        // Ensure environment.
        this.config.env = this.config.env || 'development';
        // Set Node environment.
        process.env.NODE_ENV = this.config.env;
        // Setup the Logger.
        var logger;
        // Ensure we have a logger if
        // not then create default logger.
        logger = this.config.logger ||
            { 'default': new winston_1.Logger({
                    level: 'debug',
                    transports: [
                        new (winston_1.transports.Console)(),
                        new (winston_1.transports.File)({
                            filename: 'logs/recrent.log',
                            handleExceptions: true,
                            humanReadableUnhandledException: true
                        })
                    ]
                }) };
        // Create a temp logger variable to
        // test if is LoggerInstance.
        var tmpLogger = logger;
        // If is loggerInstance define
        // as default logger.
        if (tmpLogger.level)
            this.loggers = { 'default': logger };
        else
            this.loggers = logger;
        return this;
    };
    /**
     * Adds/Creates a Router.
     *
     * @param {string} name
     * @param {express.Router} [router]
     * @returns {express.Router}
     *
     * @memberOf RecRent
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
     * Adds a route to the map.
     *
     * @param {(string | IRoute)} method
     * @param {string} url
     * @param {(express.Handler | Array<express.Handler>)} handlers
     * @param {string} [router]
     * @returns {RecRent}
     *
     * @memberOf RecRent
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
     * @memberOf Framework
     */
    Facile.prototype.addRoutes = function (routes) {
        var _this = this;
        routes.forEach(function (r) {
            _this.addRoute(r);
        });
    };
    Facile.prototype.addRoutesMap = function (router, routes) {
    };
    /**
     * Start Server.
     *
     * @param {Function} [fn]
     *
     * @memberOf RecRent
     */
    Facile.prototype.start = function (fn) {
        // Ensure Routers exist.
        this.routers = this.routers || {};
        // Check for default router.
        if (!this.routers['default'])
            this.routers['default'] = this.app._router;
        // call build.
        // Create Https if Certificate.
        if (this.config.certificate)
            this.server = https_1.createServer(this.config.certificate, this.app);
        else
            this.server = http_1.createServer(this.app);
        // Listen for connections.
        this.server.listen(this.config.port, this.config.host);
        this.server.on('listening', fn);
        return this;
    };
    /**
     * Stops the server.
     *
     * @param {string} [msg]
     * @param {number} [code]
     * @returns {void}
     *
     * @memberOf Framework
     */
    Facile.prototype.stop = function (msg, code) {
        if (!this.server) {
            return;
        }
    };
    return Facile;
}(events.EventEmitter));
exports.Facile = Facile;
//# sourceMappingURL=index.js.map