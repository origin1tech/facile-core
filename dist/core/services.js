"use strict";
/**
 * Initializes Services
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    that.logger.debug('Initializing Services');
    that.emit('init:filters');
    return that.init();
}
exports.init = init;
//# sourceMappingURL=services.js.map