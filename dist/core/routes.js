"use strict";
var lodash_1 = require('lodash');
function init(facile) {
    return function (fn) {
        function handleRoutes() {
            facile.logger.debug('Initializing Routes');
            lodash_1.each(facile._routes, function (route) {
                console.log(route);
            });
            if (facile._config.auto)
                facile.execAfter('init:routes', function () {
                    facile.emit('init:done');
                });
            else if (fn)
                fn();
            else
                return facile.init();
        }
        if (facile._config.auto)
            facile.execBefore('init:routes', function () {
                handleRoutes.call(facile);
            });
        else
            return handleRoutes.call(facile);
    };
}
exports.init = init;
//# sourceMappingURL=routes.js.map