"use strict";
/**
 * Initializes Filters
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    that.logger.debug('Initializing Filters');
    that.emit('init:filters');
    return that.init();
}
exports.init = init;
//# sourceMappingURL=filters.js.map