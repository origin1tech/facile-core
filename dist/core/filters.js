"use strict";
/**
 * Initializes Filters
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    function handleFilters() {
        that.logger.debug('Initializing Filters');
        // Init code here.
        if (that._config.auto)
            that.execAfter('init:filters', function () {
                that.emit('init:models');
            });
        else
            return that.init();
    }
    if (that._config.auto)
        that.execBefore('init:filters', function () {
            handleFilters();
        });
    else
        return handleFilters();
}
exports.init = init;
//# sourceMappingURL=filters.js.map