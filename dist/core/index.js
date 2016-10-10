"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var express = require('express');
var Boom = require('boom');
var winston_1 = require('winston');
var http_1 = require('http');
var https_1 = require('https');
var lodash_1 = require('lodash');
var chalk_1 = require('chalk');
// Internal Dependencies.
var utils = require('./utils');
var lifecycle_1 = require('./lifecycle');
var defaults = require('./defaults');
var server = require('./server');
var services = require('./services');
var filters = require('./filters');
var models = require('./models');
var controllers = require('./controllers');
var routes = require('./routes');
// Get Facile and App packages.
var packages = defaults.packages;
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
        this._auto = false;
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
        this._pkg = packages.pkg;
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
    Facile.prototype.configure = function (config, init, fn) {
        var _this = this;
        // Check if config is boolean.
        if (lodash_1.isBoolean(config)) {
            fn = init;
            init = config;
            config = undefined;
        }
        // If auto hooks enabled ensure init is false.
        if (this._auto)
            init = false;
        // Check if configuration is string.
        // If yes try to load the config.
        if (lodash_1.isString(config))
            config = this.config(config);
        // Extend options with defaults.
        this._config = lodash_1.extend({}, defaults.config, config);
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
        // Check for auto init hooks/listeners.
        if (this._config.auto)
            this.hooks();
        // Emit Configured.
        this.emit('init', this);
        if (!init)
            return this;
        // Load controllers, models and services.
        return this.start(true, fn);
    };
    /**
     * Returns Initialization Methods
     *
     * @returns {IInit}
     *
     * @memberOf Facile
     */
    Facile.prototype.init = function () {
        var self = this;
        function configured() {
            self.emit('init:server');
            return self.init();
        }
        // Used when individually calling
        // inits on done returns back to
        // main context for chaining to
        // start.
        function done() {
            self.emit('core:start');
            return self;
        }
        // Iterates all inits then
        // calls done to return to
        // main context.
        function all() {
            return done();
        }
        var inits = {
            configured: configured.bind(this),
            server: server.init.bind(this),
            services: services.init.bind(this),
            filters: filters.init.bind(this),
            models: models.init.bind(this),
            controllers: controllers.init.bind(this),
            routes: routes.init.bind(this),
            all: all.bind(this),
            done: done.bind(this)
        };
        return inits;
    };
    /**
     * Initializes Lifecycle Events.
     *
     * Events
     *
     * init
     * init:server
     * init:services
     * init:filters
     * init:models
     * init:controllers
     * init:routes
     * init:done
     * core:listening
     *
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.hooks = function () {
        var init = this.init();
        this.on('init', init.configured);
        this.on('init:server', init.server);
        this.on('init:services', init.services);
        this.on('init:filters', init.filters);
        this.on('init:models', init.models);
        this.on('init:controllers', init.controllers);
        this.on('init:routes', init.routes);
        this.on('core:start', this.start);
        this.on('core:listen', this.listen);
        // Set flag indicating that
        // lifecycle hooks are auto firing.
        this._auto = true;
        return this;
    };
    /**
     * Start Listening for Connections
     *
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.listen = function () {
        // Listen for connections.
        this.logger.debug('Preparing server to listen for connections.');
        this.server.listen(this._config.port, this._config.host, function (err) {
            if (err)
                throw err;
        });
        return this;
    };
    /**
     * Start Server.
     *
     * @param {Function} [fn]
     * @method
     * @memberof Facile
     */
    Facile.prototype.start = function (init, fn) {
        var _this = this;
        var self = this;
        // Allow callback as first arg.
        if (lodash_1.isFunction(init)) {
            fn = init;
            init = undefined;
        }
        // If auto hooks enabled ensure init is false.
        if (this._auto)
            init = false;
        // Check if should auto init.
        if (init) {
            // After init just return
            // start to fire up server.
            return this.start(fn);
        }
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
            _this.emit('core:listening');
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
        if (!this._auto)
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
                var max = _this.utils.maxIn(_this._middlewares, 'order') || 0;
                v.order = max;
                if (max > 0)
                    v.order += 1;
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
    Facile.prototype.addRoute = function (route) {
        var _this = this;
        var self = this;
        // Helper function to validate
        // the route and log if invalid.
        function validate(_route) {
            // Validate the route.
            _route = self.utils.validateRoute(route);
            // Push the route to the collection
            // if is valid.
            if (_route.valid)
                self._routes.push(_route);
            else
                self.logger.warn("Failed to add route \"" + _route.url + "\", the configuration is invalid.", route);
        }
        // Handle array of route objects.
        if (Array.isArray(route)) {
            var routes_1 = route;
            routes_1.forEach(function (r) {
                validate(r);
            });
        }
        else if (lodash_1.isPlainObject(route)) {
            var routes_2 = route;
            lodash_1.each(routes_2, function (v, k) {
                var r = _this.utils.parseRoute(k, v);
                validate(r);
            });
        }
        else {
            validate(route);
        }
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
}(lifecycle_1.Lifecycle));
exports.Facile = Facile;
//# sourceMappingURL=index.js.map