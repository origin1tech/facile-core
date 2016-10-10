"use strict";
/**
 * Initializes Models
 *
 * @export
 * @returns {IFacile}
 */
function init() {
    var that = this;
    function handleModels() {
        that.logger.debug('Initializing Models');
        // Init code here.
        if (that._config.auto)
            that.execAfter('init:models', function () {
                that.emit('init:controllers');
            });
        else
            return that.init();
    }
    if (that._config.auto)
        that.execBefore('init:models', function () {
            handleModels();
        });
    else
        return handleModels();
}
exports.init = init;
//# sourceMappingURL=models.js.map