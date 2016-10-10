"use strict";
var lodash_1 = require('lodash');
/**
 * Initializes Server
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    that.logger.debug('Ensuring default router.');
    // Ensure Routers exist.
    that._routers = that._routers || {};
    // Check for default router.
    if (!that._routers['default'])
        that._routers['default'] = that.app._router;
    // Sort & Iterate Middleware.
    that.logger.debug('Initializing middleware.');
    this._middlewares = lodash_1.sortBy(this._middlewares, 'order');
    lodash_1.each(this._middlewares, function (v, k) {
        that.app.use(v.fn);
    });
    that.emit('init:services');
    return that.init();
}
exports.init = init;
//# sourceMappingURL=server.js.map