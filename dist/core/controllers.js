"use strict";
/**
 * Initializes Controllers
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
function init(fn) {
    var _this = this;
    function handleControllers() {
        var _this = this;
        this.logger.debug('Initializing Controllers');
        // Init code here.
        if (this._config.auto)
            this.execAfter('init:controllers', function () {
                _this.emit('init:routes');
            });
        else if (fn)
            fn();
        else
            return this._inits;
    }
    if (this._config.auto)
        this.execBefore('init:controllers', function () {
            handleControllers.call(_this);
        });
    else
        return handleControllers.call(this);
}
exports.init = init;
//# sourceMappingURL=controllers.js.map