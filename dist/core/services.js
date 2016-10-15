"use strict";
function init(facile) {
    return function (fn) {
        function handleServices() {
            facile.log.debug('Initializing Services');
            // Initialize the services.
            //initMap(facile._services, facile);
            if (facile._config.auto)
                facile.execAfter('init:services', function () {
                    facile.emit('init:filters');
                });
            else if (fn)
                fn();
            else
                return facile.init();
        }
        if (facile._config.auto)
            facile.execBefore('init:services', function () {
                handleServices.call(facile);
            });
        else
            return handleServices.call(facile);
    };
}
exports.init = init;
//# sourceMappingURL=services.js.map