"use strict";
function init(facile) {
    return function (fn) {
        function handleFilters() {
            facile.log.debug('Initializing Filters');
            // Initialize the filters.
            var collection = facile._filters;
            // Initialize the controllers.
            // passing in instance.
            collection.initAll(facile);
            if (facile._config.auto)
                facile.execAfter('init:filters', function () {
                    facile.emit('init:models');
                });
            else if (fn)
                fn();
            else
                return facile.init();
        }
        if (facile._config.auto)
            facile.execBefore('init:filters', function () {
                handleFilters.call(facile);
            });
        else
            return handleFilters.call(facile);
    };
}
exports.init = init;
//# sourceMappingURL=filters.js.map