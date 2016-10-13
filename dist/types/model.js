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
        Object.defineProperty(this, '_facile', {
            enumerable: false,
            value: facile
        });
        return this;
    }
    Model._type = 'Model';
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=model.js.map