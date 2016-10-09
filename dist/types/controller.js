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
     *
     * @memberOf Controller
     */
    function Controller(facile) {
        this.facile = facile;
        return this;
    }
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map