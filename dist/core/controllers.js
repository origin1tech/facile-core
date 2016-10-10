"use strict";
/**
 * Initializes Controllers
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    that.logger.debug('Initializing Controllers');
    that.emit('init:routes');
    return that.init();
}
exports.init = init;
//# sourceMappingURL=controllers.js.map