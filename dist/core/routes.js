"use strict";
/**
 * Initializes Routes
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    that.logger.debug('Initializing Routes');
    that.emit('init:done');
    return that.init();
}
exports.init = init;
//# sourceMappingURL=routes.js.map