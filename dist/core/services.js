"use strict";
/**
 * Initializes Services
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
function init(fn) {
    var _this = this;
    function handleServices() {
        var _this = this;
        this.logger.debug('Initializing Services');
        // Init code here.
        if (this._config.auto)
            this.execAfter('init:services', function () {
                _this.emit('init:filters');
            });
        else if (fn)
            fn();
        else
            return this._inits;
    }
    if (this._config.auto)
        this.execBefore('init:services', function () {
            handleServices.call(_this);
        });
    else
        return handleServices.call(this);
}
exports.init = init;
//# sourceMappingURL=services.js.map