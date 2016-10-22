"use strict";
/**
 * Base Service Class
 *
 * @export
 * @class Service
 */
var Service = (function () {
    /**
     * Creates an instance of Service.
     *
     * @param {IFacile} facile
     * @constructor
     * @memberOf Service
     */
    function Service(facile) {
        this.facile = facile;
    }
    Object.defineProperty(Service.prototype, "log", {
        /**
         * log
         *
         * @desc exposes Facile.log to class.
         * @readonly
         * @member {LoggerInstance} log
         * @memberOf Service
         */
        get: function () {
            return this.facile.log;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Service.prototype, "errors", {
        /**
         * errros
         *
         * @desc exposes Facile.errors to class.
         * @readonly
         * @member {IErrors}
         * @memberOf Controller
         */
        get: function () {
            return this.facile._errors;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * service
     *
     * @method service
     * @template T
     * @param {string} name
     * @returns {T}
     *
     * @memberOf Service
     */
    Service.prototype.service = function (name) {
        var collection = this.facile._services;
        return collection.get(name);
    };
    /**
     * model
     *
     * @method model
     * @template T
     * @param {string} name
     * @returns {T}
     *
     * @memberOf Service
     */
    Service.prototype.model = function (name) {
        var collection = this.facile._models;
        return collection.get(name);
    };
    Service.type = 'Service';
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=service.js.map