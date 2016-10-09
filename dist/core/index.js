"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events = require('events');
var path_1 = require('path');
var express = require('express');
var Boom = require('boom');
var winston_1 = require('winston');
var http_1 = require('http');
var https_1 = require('https');
var lodash_1 = require('lodash');
var chalk_1 = require('chalk');
// Internal Dependencies.
var utils = require('./utils');
// Get Facile and App packages.
var pkg = require('../../package.json');
var appPkg = require(path_1.join(process.cwd(), 'package.json'));
// Default config values.
var defaults = {
    cwd: process.cwd(),
    pkg: appPkg,
    env: 'development',
    logLevel: 'info',
    host: '127.0.0.1',
    port: 8080,
    maxConnections: 128
};
/**
 * Facile Core
 *
 * @export
 * @class Facile
 * @extends {events.EventEmitter}
 * @implements {IFacile}
 */
var Facile = (function (_super) {
    __extends(Facile, _super);
    /**
     * Creates an instance of RecRent.
     *
     * @constructor
     * @memberof Facile
     */
    function Facile() {
        // Extend class with emitter.
        _super.call(this);
        this._configs = {};
        this._routers = {};
        this._nextSocketId = 0;
        this._services = {};
        this._middlewares = {};
        this._filters = {};
        this._models = {};
        this._controllers = {};
        if (Facile.instance)
            return Facile.instance;
        // Set Facile's package.json to variable.
        this._pkg = pkg;
        // Expose Facile utils.
        this.utils = utils;
        // Create the default logger.
        // This will likely be overwritten.
        var defaultLogger = new winston_1.Logger({
            level: 'info',
            transports: [
                new (winston_1.transports.Console)({
                    prettyPrint: true,
                    handleExceptions: true,
                    humanReadableUnhandledException: true
                })
            ]
        });
        // Add default logger to map 
        // and set as "log" instance.
        this.logger = defaultLogger;
        // Create Express app.
        this.app = express();
        // Set the instance.
        Facile.instance = this;
        return this;
    }
    ///////////////////////////////////////////////////
    // CONFIGURE & MANAGE SERVER
    ///////////////////////////////////////////////////
    /**
     * Configures Facile
     * optionally provide boolean to
     * auto load and start.
     *
     * @param {(IConfig | boolean)} [config]
     * @param {(boolean | ICallback)} [autoStart]
     * @param {ICallback} [fn]
     * @returns {(Facile | void)}
     *
     * @memberOf Facile
     */
    Facile.prototype.configure = function (config, autoStart, fn) {
        var _this = this;
        // Check if config is boolean.
        if (lodash_1.isBoolean(config)) {
            fn = autoStart;
            autoStart = config;
            config = undefined;
        }
        // Check if configuration is string.
        // If yes try to load the config.
        if (lodash_1.isString(config))
            config = this.config(config);
        // Extend options with defaults.
        this._config = lodash_1.extend({}, defaults, config);
        // Setup the Logger.
        if (this._config.logger)
            this.logger = this._config.logger;
        // If log level was set Iterate
        // transports and set level.
        if (this._config.logLevel)
            lodash_1.each(this.logger.transports, function (t) {
                t.level = _this._config.logLevel;
            });
        this.logger.debug('Defining Boom error handlers.');
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
        this.logger.debug('Defining node environment.');
        // Ensure environment.
        this._config.env = this._config.env || 'development';
        // Set Node environment.
        process.env.NODE_ENV = this._config.env;
        // Emit Configured.
        this.emit('core:configured', this);
        // No auto start return instance.
        if (!autoStart)
            return this;
        // Load controllers, models and services.
        this.load(autoStart, fn);
    };
    /**
     * Load Controllers, Models & Services.
     *
     * @param {boolean} [autoStart]
     * @param {ICallback} [fn]
     * @returns {(Facile | void)}
     *
     * @memberOf Facile
     */
    Facile.prototype.load = function (autoStart, fn) {
        this.logger.debug('Ensuring default router.');
        // Ensure Routers exist.
        this._routers = this._routers || {};
        // Check for default router.
        if (!this._routers['default'])
            this._routers['default'] = this.app._router;
        // Init Services.
        this.logger.debug('Initialize Services.');
        this.utils.initMap(this._services, this);
        // Init Models.
        this.logger.debug('Initialize Models.');
        this.utils.initMap(this._models, this);
        // Init Controllers.
        this.logger.debug('Initialize Controllers.');
        this.utils.initMap(this._controllers, this);
        this.emit('core:loaded');
        // No auto start return instance.
        if (!autoStart)
            return this;
        // Start the server.
        this.start(fn);
    };
    /**
     * Start Server.
     *
     * @param {Function} [fn]
     * @method
     * @memberof Facile
     */
    Facile.prototype.start = function (fn) {
        var _this = this;
        var self = this;
        this.logger.debug('Configuring server protocol and settings.');
        // Create Https if Certificate.
        if (this._config.certificate)
            this.server = https_1.createServer(this._config.certificate, this.app);
        else
            this.server = http_1.createServer(this.app);
        // Limit server connections.
        this.server.maxConnections = this._config.maxConnections;
        // Listener callback on server listening.
        this.server.on('listening', function () {
            var address = _this.server.address(), addy = address.address, port = address.port;
            console.log(chalk_1.cyan('\nServer listening at: http://' + addy + ':' + port));
            // Call if callack function provided.
            if (fn) {
                _this.logger.debug('Exec callback on server start/listening.');
                fn(_this);
            }
        });
        // Store connections
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
        // Listen for connections.
        this.logger.debug('Preparing server to listen for connections.');
        this.server.listen(this._config.port, this._config.host, function (err) {
            if (err)
                throw err;
        });
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
        var socketKeys = Object.keys(this._sockets);
        this.logger.debug('Closing active (' + socketKeys.length + ') socket connections.');
        socketKeys.forEach(function (id) {
            var socket = _this._sockets[id];
            if (socket)
                socket.destroy();
        });
        // Close the server.
        this.logger.debug('Closing server.');
        this.server.close(function () {
            console.log(chalk_1.cyan('\nServer successfully closed.'));
        });
    };
    ///////////////////////////////////////////////////
    // REGISTERING RESOURCES
    ///////////////////////////////////////////////////
    /**
     * Adds a Configuration.
     *
     * @param {string} name
     * @param {IConfig} config
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addConfig = function (name, config) {
        this.utils.extendMap(name, config, this._configs);
        return this;
    };
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
        var _this = this;
        // If object check if "default" was passed.
        var hasDefault = lodash_1.isPlainObject(name) && lodash_1.has(name, 'default');
        // Check for default router.
        if (name === 'default' || hasDefault)
            throw new Error('Router name cannot be "default".');
        // Add router to map.
        if (lodash_1.isString(name))
            this._routers[name] = router || express.Router();
        else
            Object.keys(name).forEach(function (k) {
                _this._routers[k] = name[k] || express.Router();
            });
        return router;
    };
    /**
     * Registers Middleware or Middlewares to Express.
     *
     * @param {string} name
     * @param {IRequestHandler} fn
     * @param {number} [order]
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addMiddleware = function (name, fn, order) {
        var _this = this;
        var middlewares = {};
        // Adding single middleware.
        if (lodash_1.isString(name))
            middlewares[name] = {
                fn: fn,
                order: order
            };
        else
            middlewares = name;
        // Iterate the map ensure order.
        lodash_1.each(middlewares, function (v, k) {
            // No order generate.
            if (v.order === undefined) {
                v.order = _this.utils.maxIn(_this._middlewares, 'order') + 1;
            }
            else {
                var tmpOrder = v.order;
                // Prevents two middlewares with
                // same order value.
                while (_this.utils.hasIn(_this._middlewares, 'order', tmpOrder)) {
                    tmpOrder += .1;
                }
                v.order = tmpOrder;
            }
            // Update the middlewares object.
            _this._middlewares[k] = v;
        });
        return this;
    };
    /**
     * Registers a Service.
     *
     * @param {(IService | Array<IService>)} Service
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addService = function (Service) {
        this.utils.extendMap(Service, this._services);
        return this;
    };
    /**
     * Registers Filter or Map of Filters.
     *
     * @param {(string | IFilters)} name
     * @param {IRequestHandler} fn
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addFilter = function (Filter) {
        this.utils.extendMap(Filter, this._filters);
        return this;
    };
    /**
     * Registers a Model.
     *
     * @param {(IModel | Array<IModel>)} Model
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addModel = function (Model) {
        this.utils.extendMap(Model, this._models);
        return this;
    };
    /**
     * Registers a Controller.
     *
     * @param {(IController | Array<IController>)} Controller
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addController = function (Controller) {
        this.utils.extendMap(Controller, this._controllers);
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
        this._routes.push(route);
        return this;
    };
    ///////////////////////////////////////////////////
    // INSTANCE HELPERS
    ///////////////////////////////////////////////////
    /**
     * Gets a Router by name.
     *
     * @param {string} name
     * @returns {express.Router}
     *
     * @memberOf Facile
     */
    Facile.prototype.router = function (name) {
        return this._routers[name];
    };
    /**
     * Gets a Config by name.
     *
     * @param {string} name
     * @returns {IConfig}
     *
     * @memberOf Facile
     */
    Facile.prototype.config = function (name) {
        return this._configs[name];
    };
    /**
     * Gets a Service by name.
     *
     * @param {string} name
     * @returns {IService}
     *
     * @memberOf Facile
     */
    Facile.prototype.service = function (name) {
        return this._services[name];
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
        return this._filters[name];
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
        return this._models[name];
    };
    /**
     * Gets a Controller by name.
     *
     * @param {string} name
     * @returns {IController}
     *
     * @memberOf Facile
     */
    Facile.prototype.controller = function (name) {
        return this._controllers[name];
    };
    return Facile;
}(events.EventEmitter));
exports.Facile = Facile;
//# sourceMappingURL=index.js.map