"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var express = require('express');
var Boom = require('boom');
var winston_1 = require('winston');
var lodash_1 = require('lodash');
var chalk_1 = require('chalk');
// Internal Dependencies.
var utils = require('./utils');
var core_1 = require('./core');
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
 * @extends {Events}
 * @implements {IFacile}
 */
var Facile = (function (_super) {
    __extends(Facile, _super);
    /**
     * Facile constructor.
     * @constructor
     * @memberof Facile
     */
    function Facile() {
        // Extend class with emitter.
        _super.call(this);
        this._routers = {};
        this._nextSocketId = 0;
        this._sockets = {};
        this._services = {};
        this._middlewares = {};
        this._filters = {};
        this._models = {};
        this._controllers = {};
        if (Facile.instance)
            return Facile.instance;
        // Set Facile's package.json to variable.
        this._pkg = packages.pkg;
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
        this.express = express;
        this.app = express();
        // Set the instance.
        Facile.instance = this;
        return this;
    }
    ///////////////////////////////////////////////////
    // CONFIGURE & MANAGE SERVER
    ///////////////////////////////////////////////////
    /**
     * Configure
       *
     * @method configure
     * @param {(string | IConfig)} [config]
     * @returns {Facile}
     * @memberOf Facile
     */
    Facile.prototype.configure = function (config) {
        var _this = this;
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
        // Ensure config auto has value.
        this._config.auto = this._config.auto !== false ? true : false;
        // If auto enable event listeners.
        if (this._config.auto) {
            this.enableEvents();
            this.execAfter('core:configure', function () {
                _this.emit('init');
            });
        }
        else
            return this;
    };
    /**
     * Returns Initialization Methods
     *
     * @method init
     * @returns {IInit}
     * @memberOf Facile
     */
    Facile.prototype.init = function () {
        var self = this;
        // Ensure configuration.
        if (!this._config) {
            this.logger.warn('Failed to initialize please run facile.configure() first...exiting.');
            process.exit();
        }
        /**
         * Used internally to trigger
         * init events after configuration.
         *
         * @private
         * @method run
         * @returns {IInit}
         * @memberOf Facile
         */
        function run() {
            if (self._config.auto)
                self.execBefore('init', function () {
                    self.emit('init:server');
                });
            else
                return inits;
        }
        /**
         * Used internally to trigger
         * init done event.
         *
         * @member done
         * @private
         * @returns {IFacile}
         * @memberOf Facile
         */
        function done() {
            if (self._config.auto)
                self.execAfter('init', function () {
                    self.emit('core:start');
                });
            else
                return self;
        }
        /**
         * Used internally to trigger
         * all initialization events.
         *
         * @private
         * @member all
         * @returns {IFacile}
         * @memberOf Facile
         */
        function all() {
            return done();
        }
        var inits = {
            run: run.bind(this),
            server: server.init.bind(this),
            services: services.init.bind(this),
            filters: filters.init.bind(this),
            models: models.init.bind(this),
            controllers: controllers.init.bind(this),
            routes: routes.init.bind(this),
            all: all.bind(this),
            done: done.bind(this)
        };
        return run();
    };
    /**
     * Enables Lifecycle Listeners.
     *
     * Events
     *
     * core:configure
     * init
     * init:server
     * init:services
     * init:filters
     * init:models
     * init:controllers
     * init:routes
     * init:done
     * core:start
     *
     * @method enableHooks
     * @returns {Facile}
     * @memberOf Facile
     */
    Facile.prototype.enableEvents = function () {
        var init = this.init();
        this.on('init', init.run);
        this.on('init:server', init.server);
        this.on('init:services', init.services);
        this.on('init:filters', init.filters);
        this.on('init:models', init.models);
        this.on('init:controllers', init.controllers);
        this.on('init:routes', init.routes);
        this.on('core:start', this.start);
        this.on('core:listen', this.listen);
        // Set flag indicating that
        // init hooks are listening
        // in case called manually.
        this._config.auto = true;
        return this;
    };
    /**
     * Start Listening for Connections
     *
     * @method
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.listen = function () {
        // Listen for connections.
        this.logger.debug('Server preparing to listen.');
        this.server.listen(this._config.port, this._config.host, function (err) {
            if (err)
                throw err;
        });
        return this;
    };
    /**
     * Start Server.
     *
     * @method
     * @param {Function} [fn]
     * @method
     * @memberof Facile
     */
    Facile.prototype.start = function (config, fn) {
        var that = this;
        // Allow callback as first argument.
        if (lodash_1.isFunction(config)) {
            fn = config;
            config = undefined;
        }
        // Can't start without a config.
        if (!this._config) {
            // If no _config and no config throw error.
            if (!config)
                throw new Error('Attempted to start but not configured or no config was supplied.');
            var _config = config;
            // If Auto return the config as
            // auto events listeners will fire
            // start.
            if (_config.auto !== false)
                return this.configure(config);
            // Otherwise just configure.
            this.configure(config);
        }
        function handleStart() {
            that.logger.debug('Starting server preparing for connections.');
            // On listening Handle Callback.
            that.server.on('listening', function () {
                var address = that.server.address(), addy = address.address, port = address.port;
                console.log(chalk_1.cyan('\nServer listening at: http://' + addy + ':' + port));
                // Call if callack function provided.
                if (fn) {
                    that.logger.debug('Exec callback on server start/listening.');
                    fn(that);
                }
                if (that._config.auto)
                    that.execAfter('core:listen');
            });
            if (that._config.auto)
                that.execAfter('core:start', function () {
                    that.listen();
                });
            else
                return that.listen();
        }
        if (this._config.auto)
            this.execBefore('core:start', function () {
                handleStart();
            });
        else
            return handleStart();
    };
    /**
     * Stops the server.
     *
     * @method
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
     * @method
     * @param {string} name
     * @param {IConfig} config
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addConfig = function (name, config) {
        utils.extendMap(name, config, this._configs);
        return this;
    };
    /**
     * Adds/Creates a Router.
     *
     * @method
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
     * @method
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
                var max = utils.maxIn(_this._middlewares, 'order') || 0;
                v.order = max;
                if (max > 0)
                    v.order += 1;
            }
            else {
                var tmpOrder = v.order;
                // Prevents two middlewares with
                // same order value.
                while (utils.hasIn(_this._middlewares, 'order', tmpOrder)) {
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
     * @method
     * @param {(IService | Array<IService>)} Service
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addService = function (Service) {
        utils.extendMap(Service, this._services);
        return this;
    };
    /**
     * Registers Filter or Map of Filters.
     *
     * @method
     * @param {(string | IFilters)} name
     * @param {IRequestHandler} fn
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addFilter = function (Filter) {
        utils.extendMap(Filter, this._filters);
        return this;
    };
    /**
     * Registers a Model.
     *
     * @method
     * @param {(IModel | Array<IModel>)} Model
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addModel = function (Model) {
        utils.extendMap(Model, this._models);
        return this;
    };
    /**
     * Registers a Controller.
     *
     * @method
     * @param {(IController | Array<IController>)} Controller
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype.addController = function (Controller) {
        utils.extendMap(Controller, this._controllers);
        return this;
    };
    /**
     * Adds a route to the map.
     *
     * @method
     * @param {(string | IRoute)} method
     * @param {string} url
     * @param {(express.Handler | Array<express.Handler>)} handlers
     * @param {string} [router]
     * @returns {RecRent}
     *
     * @memberOf Facile
     */
    Facile.prototype.addRoute = function (route) {
        var self = this;
        // Helper function to validate
        // the route and log if invalid.
        function validate(_route) {
            // Validate the route.
            _route = utils.validateRoute(route);
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
                var r = utils.parseRoute(k, v);
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
     * @method
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
     * @method
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
     * @method
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
     * @method
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
     * @method
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
     * @method
     * @param {string} name
     * @returns {IController}
     *
     * @memberOf Facile
     */
    Facile.prototype.controller = function (name) {
        return this._controllers[name];
    };
    /**
     * Wrapper for utils extend.
     *
     * @param {...any[]} args
     * @returns {*}
     *
     * @memberOf Facile
     */
    Facile.prototype.extend = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return lodash_1.extend.apply(null, args);
    };
    return Facile;
}(core_1.Core));
exports.Facile = Facile;
//# sourceMappingURL=index.js.map