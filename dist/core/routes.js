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
    // Get the global security filter.
    var securityFilter = facile._config.routes && facile._config.routes.securityFilter;
    // Map of cached global controller policies.
    var ctrlPols = {};
    // Global Policy should always be defined.
    if (globalPol === undefined) {
        facile.log.error('Security risk detected, please define a global policy.');
        process.exit();
    }
    // Lookup a filter method from string.
    function lookupFilter(filter, collection) {
        var action = lodash_1.get(collection._components, filter);
        var klassName = filter.split('.').shift();
        var klass = collection.get(klassName);
        // Bind to class so we don't lose context.
        return action.bind(klass);
    }
    // Normalize all filters looking
    // up or setting to global security filter.
    function normalizeFilters(filters, ctrl) {
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
                if (f === false)
                    _normalized.push(lookupFilter(securityFilter, filterCol));
            }
            else if (lodash_1.isString(f)) {
                // May be in filters or controllers.
                var collection = ctrl ? ctrlCol : filterCol;
                var filter = lookupFilter(f, collection);
                if (filter) {
                    _normalized.push(filter);
                }
                else {
                    facile.log.warn('Failed to load ' + lookupFilter + ' "' + f + '", ' + lookupFilter + ' could not be resolved.');
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
    // Looks up filters and controller
    // normalizing as Express handers.
    function addRoute(route) {
        var router = facile.router(route.router);
        var methods = route.method;
        var _route = router.route(route.url);
        var _policies = lookupPolicies(route.handler);
        var _filters = normalizeFilters(route.filters);
        var _handler = normalizeFilters(route.handler, true);
        var _handlers = _policies.concat(_filters).concat(_handler);
        // Iterate adding handlers
        // for each method.
        methods.forEach(function (m) {
            if (!_handlers || !_handlers.length)
                return facile.log.warn('Failed to initialize route "' + route.url + '" invalid or missing handler.');
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