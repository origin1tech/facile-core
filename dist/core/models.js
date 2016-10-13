"use strict";
var utils_1 = require('./utils');
function init(facile) {
    return function (fn) {
        function handleModels() {
            facile.logger.debug('Initializing Models');
            // Initialize the services.
            utils_1.initMap(facile._models, facile);
            if (facile._config.auto)
                facile.execAfter('init:models', function () {
                    facile.emit('init:controllers');
                });
            else if (fn)
                fn();
            else
                return facile.init();
        }
        if (facile._config.auto)
            facile.execBefore('init:models', function () {
                handleModels.call(facile);
            });
        else
            return handleModels.call(facile);
    };
}
exports.init = init;
//# sourceMappingURL=models.js.map