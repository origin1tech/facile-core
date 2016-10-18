"use strict";
/**
 * Base Model Class
 *
 * @export
 * @class Model
 */
var Model = (function () {
    /**
     * Creates an instance of Model.
     *
     * @param {IFacile} facile
     * @constructor
     * @memberOf Model
     */
    function Model(facile) {
        Object.defineProperty(this, 'facile', {
            enumerable: false,
            value: facile
        });
        return this;
    }
    Object.defineProperty(Model.prototype, "log", {
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
    Object.defineProperty(Model.prototype, "errors", {
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
     * init
     *
     * @desc initializes the model.
     * @method init
     * @memberOf Model
     */
    Model.prototype.init = function () {
        throw new Error('Not Implmented: Model init method must be overridden.');
    };
    Model.type = 'Model';
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=model.js.map