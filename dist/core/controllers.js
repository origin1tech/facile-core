"use strict";
var lodash_1 = require('lodash');
function init(facile) {
    return function (fn) {
        function handleControllers() {
            facile.logger.debug('Initializing Controllers');
            // Initialize the controllers.
            lodash_1.each(facile._controllers, function (Ctrl, key) {
                facile._controllers[key] = new Ctrl(facile);
            });
            console.log(facile._controllers);
            if (facile._config.auto)
                facile.execAfter('init:controllers', function () {
                    facile.emit('init:routes');
                });
            else if (fn)
                fn();
            else
                return facile.init();
        }
        if (facile._config.auto)
            facile.execBefore('init:controllers', function () {
                handleControllers.call(facile);
            });
        else
            return handleControllers.call(facile);
    };
}
exports.init = init;
//# sourceMappingURL=controllers.js.map