"use strict";
/**
 * Initializes Models
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
function init(fn) {
    var _this = this;
    function handleModels() {
        var _this = this;
        this.logger.debug('Initializing Models');
        // Init code here.
        if (this._config.auto)
            this.execAfter('init:models', function () {
                _this.emit('init:controllers');
            });
        else if (fn)
            fn();
        else
            return this._inits;
    }
    if (this._config.auto)
        this.execBefore('init:models', function () {
            handleModels.call(_this);
        });
    else
        return handleModels.call(this);
}
exports.init = init;
//# sourceMappingURL=models.js.map