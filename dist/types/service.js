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
    Service.type = 'Service';
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=service.js.map