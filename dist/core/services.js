"use strict";
/**
 * Initializes Services
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    this.logger.debug('Initializing Services');
    this.emit('services:init');
    return this;
}
exports.init = init;
//# sourceMappingURL=services.js.map