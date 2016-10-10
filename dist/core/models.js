"use strict";
/**
 * Initializes Models
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    that.logger.debug('Initializing Models');
    that.emit('init:controllers');
    return that.init();
}
exports.init = init;
//# sourceMappingURL=models.js.map