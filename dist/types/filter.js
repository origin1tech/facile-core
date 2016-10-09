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
     *
     * @memberOf Filter
     */
    function Filter(facile) {
        this.facile = facile;
        return this;
    }
    return Filter;
}());
exports.Filter = Filter;
//# sourceMappingURL=filter.js.map