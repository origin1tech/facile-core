"use strict";
/**
 * Initializes Filters
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
function init(fn) {
    var _this = this;
    function handleFilters() {
        var _this = this;
        this.logger.debug('Initializing Filters');
        // Init code here.
        if (this._config.auto)
            this.execAfter('init:filters', function () {
                _this.emit('init:models');
            });
        else if (fn)
            fn();
        else {
            console.log('hit3');
            return this._inits;
        }
    }
    if (this._config.auto)
        this.execBefore('init:filters', function () {
            handleFilters.call(_this);
        });
    else
        return handleFilters.call(this);
}
exports.init = init;
//# sourceMappingURL=filters.js.map