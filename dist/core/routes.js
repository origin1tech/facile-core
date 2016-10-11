"use strict";
/**
 * Initializes Routes
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
function init(fn) {
    var _this = this;
    function handleRoutes() {
        var _this = this;
        this.logger.debug('Initializing Routes');
        // Init code here.
        if (this._config.auto)
            this.execAfter('init:routes', function () {
                _this.emit('init:done');
            });
        else if (fn)
            fn();
        else
            return this._inits;
    }
    if (this._config.auto)
        this.execBefore('init:routes', function () {
            handleRoutes.call(_this);
        });
    else
        return handleRoutes.call(this);
}
exports.init = init;
//# sourceMappingURL=routes.js.map