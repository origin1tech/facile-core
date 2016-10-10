"use strict";
/**
 * Initializes Routes
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    function handleRoutes() {
        that.logger.debug('Initializing Routes');
        // Init code here.
        if (that._config.auto)
            that.execAfter('init:routes', function () {
                that.emit('init:done');
            });
        else
            return that.init();
    }
    if (that._config.auto)
        that.execBefore('init:routes', function () {
            handleRoutes();
        });
    else
        return handleRoutes();
}
exports.init = init;
//# sourceMappingURL=routes.js.map