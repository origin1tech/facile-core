"use strict";
/**
 * Initializes Controllers
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    this.logger.debug('Initializing Controllers');
    this.emit('controllers:init');
    return this;
}
exports.init = init;
//# sourceMappingURL=controllers.js.map