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
        return this;
    }
    Controller.type = 'Controller';
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map