"use strict";
/**
 * Initializes Models
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    this.logger.debug('Initializing Models');
    this.emit('models:init');
    return this;
}
exports.init = init;
//# sourceMappingURL=models.js.map