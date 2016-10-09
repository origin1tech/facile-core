"use strict";
/**
 * Initializes Routes
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    this.logger.debug('Initializing Routes');
    this.emit('routes:init');
    return this;
}
exports.init = init;
//# sourceMappingURL=routes.js.map