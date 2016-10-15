"use strict";
function init(facile) {
    return function (fn) {
        function handleControllers() {
            facile.log.debug('Initializing Controllers');
            var collection = facile._controllers;
            // Initialize the controllers.
            // passing in instance.
            collection.initAll(facile);
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