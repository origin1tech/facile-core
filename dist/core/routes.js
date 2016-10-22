"use strict";
var lodash_1 = require('lodash');
function init(facile) {
    // Get Controllers Collection.
    var ctrlCol = facile._controllers;
    // Get Filters Collection.
    var filterCol = facile._filters;
    // Get all policies.
    var policies = facile._policies;
    // Get the global policy.
    var globalPol = policies['*'];
    // Routes configuration.
    var routesConfig = facile._config.routes;
    // Get the global security filter.
    var securityFilter = routesConfig.handlers && routesConfig.handlers.security;
    // Map of cached global controller policies.
    var ctrlPols = {};
    // Global Policy should always be defined.
    if (globalPol === undefined) {
        facile.log.error('Security risk detected, please define a global policy.');
        process.exit();
    }
    // Lookup a action method from string.
    function lookupAction(action, collection, route) {
        facile.log.debug('Looking up route action "' + action + '".');
        var klassName = action.split('.').shift();
        var klass = collection.get(klassName);
        var klassAction = lodash_1.get(collection._components, action);
        if (!klassAction)
            return undefined;
        if (route) {
            // Check if action is view or redirect.
            if (route.view || route.redirect)
                return klassAction.bind(klass, route.view || route.redirect)();
            // Check if generated route using model.
            if (route.model)
                return klassAction.bind(klass, route.model)();
        }
        // Bind to class so we don't lose context.
        return klassAction.bind(klass);
    }
    // Normalize all filters looking
    // up or setting to global security filter.
    function normalizeFilters(filters, ctrl, route) {
        var lookupType = ctrl ? 'controller' : 'filter';
        var _normalized = [];
        // Ensure filters are an array.
        if (!Array.isArray(filters))
            filters = [filters];
        // Just return if empty array.
        if (!filters.length)
            return [];
        // Iterate the array and normalize to
        // request handlers.
        filters.forEach(function (f, i) {
            if (f === undefined)
                return;
            // If function just push to normalized array.
            if (lodash_1.isFunction(f)) {
                return _normalized.push(f);
            }
            else if (lodash_1.isBoolean(f) && !ctrl) {
                // Only normalize if true.
                // if false skip.
                if (f === false) {
                    if (lodash_1.isFunction(securityFilter)) {
                        _normalized.push(securityFilter);
                    }
                    else {
                        var action = lookupAction(securityFilter, filterCol);
                        if (action)
                            _normalized.push(action);
                        else
                            facile.log.warn('Failed to load ' + lookupType + ' the filter/action "' + securityFilter + '" could not be resolved.');
                    }
                }
            }
            else if (lodash_1.isString(f)) {
                // May be in filters or controllers.
                var collection = ctrl ? ctrlCol : filterCol;
                var action = lookupAction(f, collection, route);
                if (action) {
                    _normalized.push(action);
                }
                else {
                    facile.log.warn('Failed to load ' + lookupType + ' the filter/action "' + f + '" could not be resolved.');
                }
            }
            else {
                var validTypes = ctrl ? 'string or function' : 'string, boolean or function';
                facile.log.warn('Failed to normalize ' + lookupType + ' expected ' + validTypes + ' but got "' + typeof f + '".');
                // If not development exit to
                // ensure production app is not
                // served with broken filters.
                if (facile._config.env !== 'development')
                    process.exit();
            }
        });
        return _normalized;
    }
    // Lookup policies by ctrl
    // name and action name.
    function lookupPolicies(handler) {
        facile.log.debug('Looking up security policy/filters for route hanlder "' + handler + '".');
        var globalPolNormalized;
        var ctrlName = handler.split('.').shift();
        var rawFilters = lodash_1.get(policies, handler);
        var ctrlGlobalPol = lodash_1.get(policies, ctrlName + '.*');
        var ctrlGlobalPols;
        var actionFilters;
        var result;
        globalPolNormalized = normalizeFilters(globalPol);
        if (ctrlPols[ctrlName] && ctrlPols[ctrlName]['*'])
            ctrlGlobalPols = ctrlPols[ctrlName]['*'];
        else if (ctrlGlobalPol)
            ctrlGlobalPols = normalizeFilters(ctrlGlobalPol);
        if (ctrlGlobalPols && ctrlGlobalPols.length) {
            ctrlPols[ctrlName] = ctrlPols[ctrlName] || {};
            ctrlPols[ctrlName]['*'] = ctrlGlobalPols;
        }
        // Ensure Global Policy is array.
        ctrlGlobalPols = ctrlGlobalPols || [];
        // Get the normalized filters.
        result = normalizeFilters(rawFilters);
        // Set pols to controller global
        // if no handler filer.
        if (!result.length)
            result = ctrlGlobalPols;
        // Check global policies.
        // Always cascade global.
        result = globalPolNormalized.concat(result || []);
        return result;
    }
    // Checks if route handler is view or redirect
    // then normalizes and returns.
    function normalizeViewRedirect(route) {
        if (route.handler === 'view' || route.handler === 'redirect')
            route.handler = routesConfig.handlers[route.handler];
        return route;
    }
    // Looks up filters and controller
    // normalizing as Express handers.
    function addRoute(route) {
        var router = facile.router(route.router);
        var methods = route.method;
        // Normalize view and redirects.
        route = normalizeViewRedirect(route);
        var _policies = lookupPolicies(route.handler);
        var _filters = normalizeFilters(route.filters);
        var _handler = normalizeFilters(route.handler, true, route);
        var _handlers = _policies.concat(_filters).concat(_handler);
        // Iterate adding handlers
        // for each method.
        if (!_handler.length || !_handlers.length)
            return facile.log.warn('Failed to initialize route "' + route.url + '" invalid or missing handler.');
        var _route = router.route(route.url);
        methods.forEach(function (m) {
            _route[m](_handlers);
        });
    }
    return function (fn) {
        function handleRoutes() {
            facile.log.debug('Initializing Routes');
            var routes = facile._routes;
            var sortConfig = facile._config.routes.sort;
            // if route sorting is enabled
            // sort the routes.
            if (sortConfig !== false)
                routes = lodash_1.orderBy(routes, 'url', 'desc');
            // Iterate and add routes.
            lodash_1.each(routes, function (route) {
                addRoute(route);
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