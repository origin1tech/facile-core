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
        Object.defineProperty(this, 'facile', {
            enumerable: false,
            value: facile
        });
        return this;
    }
    Object.defineProperty(Service.prototype, "log", {
        /**
         * log
         *
         * @desc exposes Facile.log to class.
         * @readonly
         * @method {LoggerInstance} log
         * @memberOf Service
         */
        get: function () {
            return this.facile.log;
        },
        enumerable: true,
        configurable: true
    });
    Service.type = 'Service';
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=service.js.map