"use strict";
/**
 * Base Controller Class
 *
 * @export
 * @class Controller
 */
var Controller = (function () {
    /**
     * Creates an instance of Controller.
     *
     * @param {IFacile} facile
     * @constructor
     * @memberOf Controller
     */
    function Controller(facile) {
        Object.defineProperty(this, 'facile', {
            enumerable: false,
            value: facile
        });
    }
    Object.defineProperty(Controller.prototype, "log", {
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
    Controller.type = 'Controller';
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map