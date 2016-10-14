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
        if (Facile.instance)
            return Facile.instance;
        // Set Facile's package.json to variable.
        this._pkg = packages.pkg;
        // set the app's package.json.
        this._apppkg = packages.apppkg;
        // Create the default logger.
        // This will likely be overwritten.
        var defaultLogger = new winston_1.Logger({
            level: 'info',
            transports: [
                new (winston_1.transports.Console)({
                    colorize: true,
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
        this._initialized = false;
        this._started = false;
        // support v5.x see app.router instead of app._router.
        this._routers['default'] = this.app.router || this.app._router;
        // Set the instance.
        Facile.instance = this;
        return this;
    }
    ///////////////////////////////////////////////////
    // PRIVATE METHODS
    ///////////////////////////////////////////////////
    /**
     * Enables Lifecycle Listeners.
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
     * core:start
     *
     * @private
     * @method _enableListeners
     * @returns {Facile}
     * @memberOf Facile
     */
    Facile.prototype._enableListeners = function () {
        var init = this.init();
        this.on('init', init.run);
        this.on('init:server', init.server);
        this.on('init:services', init.services);
        this.on('init:filters', init.filters);
        this.on('init:models', init.models);
        this.on('init:controllers', init.controllers);
        this.on('init:routes', init.routes);
        this.on('init:done', init.done);
        this.on('core:start', this.start);
        this.on('core:listen', this._listen);
        // Set flag indicating that
        // init hooks are listening
        // in case called manually.
        this._config.auto = true;
        return this;
    };
    /**
     * Start Listening for Connections
     *
     * @private
     * @method _listen
     * @returns {Facile}
     *
     * @memberOf Facile
     */
    Facile.prototype._listen = function () {
        if (!this._started) {
            this.logger.error('Facile.listen() cannot be called directly please use .start().');
            process.exit();
        }
        // Listen for connections.
        this.logger.debug('Server preparing to listen.');
        this.server.listen(this._config.port, this._config.host, function (err) {
            if (err)
                throw err;
        });
    };
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
        this._configured = true;
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
        var facile = this;
        // Ensure configuration.
        if (!this._config) {
            this.logger.warn('Failed to initialize please run facile.configure()...exiting.');
            process.exit();
        }
        if (this._config.auto && !this._autoInit) {
            console.log('');
            this.logger.error('Facile config set to "auto" but attempted to init manually.');
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
            if (!facile._config.auto) {
                this.logger.error('The method init().run() cannot be called manually use { auto: true } in your configuration.');
                process.exit();
            }
            facile.execBefore('init', function () {
                facile.emit('init:server');
            });
        }
        /**
         * Used internally to trigger
         * init done event.
         *
         * @member done
         * @private
         * @returns {Facile}
         * @memberOf Facile
         */
        function done() {
            facile.logger.debug('Facile initialization complete.');
            facile._initialized = true;
            if (facile._config.auto) {
                facile.execAfter('init', function () {
                    facile.emit('core:start');
                });
            }
            else {
                return facile;
            }
        }
        var inits = {
            // run: 					run.bind(that),
            // server: 				server.init.bind(that),
            // services: 			services.init.bind(that),
            // filters: 			filters.init.bind(that),
            // models: 				models.init.bind(that),
            // controllers: 	controllers.init.bind(that),
            // routes: 				routes.init.bind(that),
            // done: 					done.bind(that)
            run: run,
            server: server.init(facile),
            services: services.init(facile),
            filters: filters.init(facile),
            models: models.init(facile),
            controllers: controllers.init(facile),
            routes: routes.init(facile),
            done: done
        };
        return inits;
    };
    /**
     * Start Server.
     *
     * @method start
     * @param {Function} [fn]
     * @method
     * @memberof Facile
     */
    Facile.prototype.start = function (config, fn) {
        var _this = this;
        // Allow callback as first argument.
        if (lodash_1.isFunction(config)) {
            fn = config;
            config = undefined;
        }
        /////////////////////////////
        // Wait/Start Facile
        /////////////////////////////
        function handleStart() {
            var _this = this;
            // On listening Handle Callback.
            this.server.on('listening', function () {
                var address = _this.server.address(), addy = address.address, port = address.port;
                if (_this._config.auto)
                    _this.execAfter('core:listen');
                // Call if callack function provided.
                if (fn)
                    fn(_this);
                console.log(chalk_1.cyan('\nServer listening at: http://' + addy + ':' + port));
            });
            if (this._config.auto) {
                this.execAfter('core:start', function () {
                    _this._started = true;
                    _this.emit('core:listen');
                });
            }
            else {
                this._started = true;
                this.listen();
            }
        }
        var waitId;
        /**
         * Waits to start server until initialized.
         * This is only used when "auto" is NOT set
         * to true in your config.
         */
        function handleWaitStart() {
            if (!this._initialized) {
                waitId = setTimeout(handleWaitStart.bind(this), 10);
            }
            else {
                clearTimeout(waitId);
                handleStart.call(this);
            }
        }
        /////////////////////////////
        // Ensure Configuration
        /////////////////////////////
        if (!this._configured)
            this.configure(config);
        // Can't continue without configuration.
        // Should never hit but just in case.
        if (!this._config) {
            console.log('');
            this.logger.error('Failed to start Facile missing or invalid configuration.');
            process.exit();
        }
        /////////////////////////////
        // Manual or Auto Init
        /////////////////////////////
        if (this._config.auto) {
            this.logger.debug('Auto configuration detected.');
            // Initialize first which will round
            // trip and call start again falling
            // through to the execution below.
            if (!this._initialized) {
                // ensures manual init is not called while auto is set.
                this._autoInit = true;
                this._enableListeners();
                this.init().run();
            }
            else {
                this.execBefore('core:start', function () {
                    handleStart.call(_this);
                });
                return this;
            }
        }
        else {
            // When starting manually must have
            // called configure and init manually
            // before starting.
            if (!this._initialized) {
                console.log('');
                this.logger.error('Facile failed to start call facile.init() before starting.');
                process.exit();
            }
            handleWaitStart.call(this);
            // Don't wait just return.
            return this;
        }
    };
    /**
     * Stops the server.
     *
     * @method stop
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
    Facile.prototype.registerConfig = function (name) {
        var _this = this;
        var extend = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extend[_i - 1] = arguments[_i];
        }
        var self = this;
        var _configs = [];
        function normalizeConfigs(arr, reset) {
            if (reset)
                _configs = [{}];
            arr.forEach(function (c) {
                if (lodash_1.isString(c))
                    _configs.push(self.config(c) || {});
                else if (lodash_1.isPlainObject(c))
                    _configs.push(c);
            });
        }
        if (lodash_1.isPlainObject(name)) {
            lodash_1.each(name, function (v, k) {
                normalizeConfigs(extend, true);
                _configs.push(v);
                _this._configs[k] = lodash_1.extend.apply(null, _configs);
            });
        }
        else {
            normalizeConfigs(extend, true);
            this._configs[name] = lodash_1.extend.apply(null, _configs);
        }
        return this;
    };
    Facile.prototype.registerMiddleware = function (name, fn, order) {
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
    Facile.prototype.registerRoute = function (route) {
        var self = this;
        // Helper function to validate
        // the route and log if invalid.
        function validate(_route) {
            // Validate the route.
            _route = utils.validateRoute(_route);
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
                var rte = utils.parseRoute(k, v);
                validate(rte);
            });
        }
        else {
            validate(route);
        }
        return this;
    };
    Facile.prototype.registerPolicy = function (name, action, policy) {
        var _this = this;
        var self = this;
        function isValidParent(key, val) {
            if (key !== '*' && !lodash_1.isPlainObject(val)) {
                self.logger.warn('Invalid parent policy key "' + key + '" ignored, parent policy values must be objects execpt global policy key.');
                return false;
            }
            else if (key === '*' && (!lodash_1.isString(val) && !Array.isArray(val)) || lodash_1.isPlainObject(val)) {
                self.logger.warn('Invalid global policy key ignored, only boolean, strings, arrays of string or arrays of functions are supported.');
                return false;
            }
            return true;
        }
        // Adding policy with action plicy.
        if (arguments.length === 3) {
        }
        else if (lodash_1.isPlainObject(name)) {
            Object.keys(name).forEach(function (key) {
                var val = Object[key];
                _this._policies[key] = _this._policies[key] || {};
                if (isValidParent(key, val)) {
                    if (key === '*')
                        _this._policies[key] = val;
                    else
                        _this._policies[key] = lodash_1.extend(_this._policies[key], val);
                }
            });
        }
        else {
            this._policies[name] = this._policies[name] || {};
        }
        return this;
    };
    Facile.prototype.registerComponent = function (name, Component) {
        var self = this;
        var Comp;
        function registerFailed(type) {
            self.logger.error('Failed to register using unsupported type "' + type + '".');
            process.exit();
        }
        function registerByType(type) {
            var collection;
            if (type === 'Service')
                collection = self._services;
            else if (type === 'Filter')
                collection = self._filters;
            else if (type === 'Controller')
                collection = self._controllers;
            else if (type === 'Model')
                collection = self._models;
            else
                registerFailed(typeof type);
            // If not type try to get name
            // from function/class name.
            if (lodash_1.isFunction(name)) {
                Component = name;
                name = utils.constructorName(name);
            }
            // Adding single component by name and class/function.
            if (lodash_1.isString(name)) {
                collection.add(name, Component);
            }
            else if (lodash_1.isPlainObject(name)) {
                lodash_1.each(name, function (v, k) {
                    collection.add(k, v);
                });
            }
            else {
                var failedType = typeof Component || typeof name;
                self.logger.error('Failed ot register component using unsupported type "' +
                    failedType + ' ".');
            }
            return self;
        }
        // Get the Component Type
        // before attempting to register.
        if (Component)
            Comp = Component;
        else if (lodash_1.isPlainObject(name))
            Comp = lodash_1.values(name)[0];
        else if (lodash_1.isFunction(name))
            Comp = name;
        else
            registerFailed(typeof Component || typeof name);
        return registerByType(Comp.type);
    };
    ///////////////////////////////////////////////////
    // INSTANCE HELPERS
    ///////////////////////////////////////////////////
    /**
     * router
     *
     * @desc gets or creates a router.
     * @method router
     * @param {string} name
     * @returns {express.Router}
     *
     * @memberOf Facile
     */
    Facile.prototype.router = function (name, options) {
        if (!this._routers[name])
            this._routers[name] = express.Router(options);
        return this._routers[name];
    };
    /**
     * Gets a Config by name.
     *
     * @method config
     * @param {string} name
     * @returns {IConfig}
     *
     * @memberOf Facile
     */
    Facile.prototype.config = function (name) {
        return this._configs[name];
    };
    /**
     * Gets a Service
     *
     * @method service
     * @template T
     * @param {string} name
     * @returns {T}
     *
     * @memberOf Facile
     */
    Facile.prototype.service = function (name) {
        var component = this._services[name];
        return component;
    };
    /**
     * Gets a Filter
     *
     * @method filter
     * @template T
     * @param {string} name
     * @returns {T}
     *
     * @memberOf Facile
     */
    Facile.prototype.filter = function (name) {
        var component = this._filters[name];
        return component;
    };
    /**
     * Gets a Model
     *
     * @method model
     * @template T
     * @param {string} name
     * @returns {T}
     *
     * @memberOf Facile
     */
    Facile.prototype.model = function (name) {
        var component = this._models[name];
        return component;
    };
    /**
     * Gets a Controller.
     *
     * @method controller
     * @template T
     * @param {string} name
     * @returns {T}
     *
     * @memberOf Facile
     */
    Facile.prototype.controller = function (name) {
        var component = this._controllers[name];
        return component;
    };
    /**
     * Convenience wrapper for lodash extend.
     *
     * @method extend
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