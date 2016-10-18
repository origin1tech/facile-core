"use strict";
/**
 * Base Filter Class
 *
 * @export
 * @class Filter
 * @implements {IFilter}
 */
var Filter = (function () {
    /**
     * Creates an instance of Filter.
     *
     * @param {IFacile} facile
     * @contructor
     * @memberOf Filter
     */
    function Filter(facile) {
        Object.defineProperty(this, 'facile', {
            enumerable: false,
            value: facile
        });
        return this;
    }
    Object.defineProperty(Filter.prototype, "log", {
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
    Object.defineProperty(Filter.prototype, "errors", {
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
    Filter.type = 'Filter';
    return Filter;
}());
exports.Filter = Filter;
//# sourceMappingURL=filter.js.map