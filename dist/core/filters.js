"use strict";
/**
 * Initializes Filters
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    this.logger.debug('Initializing Filters');
    this.emit('filters:init');
    return this;
}
exports.init = init;
//# sourceMappingURL=filters.js.map