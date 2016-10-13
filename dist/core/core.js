"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lodash_1 = require('lodash');
var events_1 = require('events');
var async_1 = require('async');
var collection_1 = require('./collection');
/**
 * Facile Core
 *
 * @export
 * @class Core
 * @extends {EventEmitter}
 * @implements {IEvents}
 */
var Core = (function (_super) {
    __extends(Core, _super);
    /**
     * Creates an instance of Core.
     *
     * @constructor
     * @memberOf Core
     */
    function Core() {
        var _this = this;
        _super.call(this);
        this._configs = {};
        this._routers = {};
        this._middlewares = {};
        this._routes = [];
        this._nextSocketId = 0;
        this._sockets = {};
        this._beforeEvents = {};
        this._afterEvents = {};
        this._initialized = false;
        this._started = false;
        this._autoInit = false;
        this._listeners = {
            'init': { before: true, after: true },
            'init:server': { before: true, after: true },
            'init:services': { before: true, after: true },
            'init:filters': { before: true, after: true },
            'init:models': { before: true, after: true },
            'init:controllers': { before: true, after: true },
            'init:routes': { before: true, after: true },
            'init:done': { before: true, after: true },
            'core:start': { before: true, after: true },
            'core:listening': { before: true, after: false }
        };
        // For each event initialize object.
        lodash_1.each(this._listeners, function (v, k) {
            _this._beforeEvents[k] = [];
            _this._afterEvents[k] = [];
        });
        // Init Component collections.
        this._services = new collection_1.Collection('services');
        this._filters = new collection_1.Collection('filters');
        this._models = new collection_1.Collection('models');
        this._controllers = new collection_1.Collection('controllers');
    }
    /**
     * Adds before event listener
     * to known Facile event.
     *
     * @member before
     * @param {string} name the name of the Facile event.
     * @param {Function} event the event to be called.
     *
     * @memberOf Core
     */
    Core.prototype.before = function (name, event) {
        if (!this._listeners[name].before) {
            this.logger.warn('Listener: ' + name + ' has no event "before".');
            return this;
        }
        // Get var to collection.
        var arr = this._beforeEvents[name];
        // Add the event.
        arr.push(event);
        return this;
    };
    /**
     * Adds after event listener
     * to known Facile event.
     *
     * @member after
     * @param {string} name the name of the Facile event.
     * @param {Function} event the event to be called.
     *
     * @memberOf Core
     */
    Core.prototype.after = function (name, event) {
        if (!this._listeners[name].after) {
            this.logger.warn('Listener: ' + name + ' has no event "after".');
            return this;
        }
        // Get var to collection.
        var arr = this._afterEvents[name];
        // Add the event.
        arr.push(event);
        return this;
    };
    /**
     * Checks if before listeners exist for event.
     *
     * @member hasBefore
     * @param {string} name
     * @returns {boolean}
     *
     * @memberOf Core
     */
    Core.prototype.hasBefore = function (name) {
        return this._beforeEvents[name] && this._beforeEvents[name].length;
    };
    /**
     * Checks if after listeners exist for event.
     *
     * @member hasAfter
     * @param {string} name
     * @returns {boolean}
     *
     * @memberOf Core
     */
    Core.prototype.hasAfter = function (name) {
        return this._afterEvents[name] && this._afterEvents[name].length;
    };
    /**
     * Executes before event listeners.
     *
     * @member execBefore
     * @param {string} name
     * @param {ICallbackResult} [fn]
     *
     * @memberOf Core
     */
    Core.prototype.execBefore = function (name, fn) {
        this.execEvents(name, this._beforeEvents, fn);
    };
    /**
     * Executes after event listeners.
     *
     * @member execAfter
     * @param {string} name
     * @param {ICallbackResult} [fn]
     *
     * @memberOf Core
     */
    Core.prototype.execAfter = function (name, fn) {
        this.execEvents(name, this._afterEvents, fn);
    };
    /**
     * Executes lifecyle events for
     * a known Facile event.
     *
     * @example
     *
     * In the example below each "before"
     * event funciton is called in series
     * until completed. Calling the callback
     * is required in each lifecycle event.
     *
     * facile.before('init:server', (done) => {
     *
     * 		// do something before server init.
     * 		// call done when finished.
     * 		done();
     *
     * 		// If there's an error pass to
     * 		// done method and it will be logged.
     * 		// done(err);
     *
     * 		// To exit simply return the callback.
     * 		// return done();
     *
     * });
     *
     * @member execEvents
     * @param {string} name
     * @param {string} type
     * @param {ICallback} [fn]
     *
     * @memberOf Core
     */
    Core.prototype.execEvents = function (name, type, fn) {
        var _this = this;
        // Get the events collection.
        var events = type[name];
        // Execute events in series.
        async_1.series(events, function (err) {
            if (err)
                _this.logger.error(err.message || 'Unknown error', err);
            if (lodash_1.isFunction(fn))
                fn();
        });
    };
    return Core;
}(events_1.EventEmitter));
exports.Core = Core;
//# sourceMappingURL=core.js.map