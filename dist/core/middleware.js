"use strict";
/**
 * Initializes Middleware
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    this.logger.debug('Initializing Middleware');
    this.emit('middleware:init');
    return this;
}
exports.init = init;
//# sourceMappingURL=middleware.js.map