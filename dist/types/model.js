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
     *
     * @memberOf Model
     */
    function Model(facile) {
        this.facile = facile;
        return this;
    }
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=model.js.map