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
        Object.defineProperty(this, '_facile', {
            enumerable: false,
            value: facile
        });
        return this;
    }
    Filter._type = 'Filter';
    return Filter;
}());
exports.Filter = Filter;
//# sourceMappingURL=filter.js.map