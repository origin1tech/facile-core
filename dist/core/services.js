"use strict";
/**
 * Initializes Services
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    function handleServices() {
        that.logger.debug('Initializing Services');
        // Init code here.
        if (that._config.auto)
            that.execAfter('init:services', function () {
                that.emit('init:filters');
            });
        else
            return that.init();
    }
    if (that._config.auto)
        that.execBefore('init:services', function () {
            handleServices();
        });
    else
        return handleServices();
}
exports.init = init;
//# sourceMappingURL=services.js.map