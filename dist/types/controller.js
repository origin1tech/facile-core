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
        Object.defineProperty(this, '_facile', {
            enumerable: false,
            value: facile
        });
        return this;
    }
    Controller._type = 'Controller';
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map