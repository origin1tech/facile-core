"use strict";
/**
 * Initializes Controllers
 *
 * @method
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    function handleControllers() {
        that.logger.debug('Initializing Controllers');
        // Init code here.
        if (that._config.auto)
            that.execAfter('init:controllers', function () {
                that.emit('init:routes');
            });
        else
            return that.init();
    }
    if (that._config.auto)
        that.execBefore('init:controllers', function () {
            handleControllers();
        });
    else
        return handleControllers();
}
exports.init = init;
//# sourceMappingURL=controllers.js.map