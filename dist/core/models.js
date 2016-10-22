"use strict";
var lodash_1 = require('lodash');
var utils_1 = require('./utils');
function init(facile) {
    var routes = facile._routes;
    // Helper to detect if url exists.
    function routeExists(url) {
        return lodash_1.some(routes, { url: url });
    }
    return function (fn) {
        function handleModels() {
            facile.log.debug('Initializing Models');
            var collection = facile._models;
            // Initialize the Models.
            collection.initAll(facile);
            // Check for route generation.
            if (facile._config.routes) {
                var models = collection.getAll();
                var routesConfig = facile._config.routes;
                // Need to case config types because
                // could be passed as boolean during configure.
                var restConfig_1 = routesConfig.rest;
                var crudConfig_1 = routesConfig.crud;
                var restCtrl_1 = restConfig_1.controller;
                var crudCtrl_1 = crudConfig_1.controller;
                lodash_1.each(models, function (model, name) {
                    var normalName = name.replace(/model$/gi, '').toLowerCase();
                    if (restConfig_1) {
                        lodash_1.each(restConfig_1.actions, function (url, action) {
                            url = url.replace(/{model}/gi, normalName);
                            if (!routeExists(url)) {
                                var _route = utils_1.parseRoute(url, {
                                    handler: restCtrl_1 + "." + action,
                                    model: model
                                });
                                facile.registerRoute(_route);
                            }
                        });
                    }
                    if (crudConfig_1) {
                        lodash_1.each(crudConfig_1.actions, function (url, action) {
                            url = url.replace(/{model}/gi, normalName);
                            if (!routeExists(url)) {
                                var _route = utils_1.parseRoute(url, {
                                    handler: crudCtrl_1 + "." + action,
                                    model: model
                                });
                                facile.registerRoute(_route);
                            }
                        });
                    }
                });
            }
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