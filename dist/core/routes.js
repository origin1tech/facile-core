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
    var globalPolNormalized;
    // Get the global security filter.
    var securityFilter = facile._config.routes && facile._config.routes.securityFilter;
    var securityFilterNormalized;
    // Map of cached global controller policies.
    var ctrlPols = {};
    // Global Policy should always be defined.
    if (globalPol === undefined) {
        facile.log.error('Security risk detected, please define a global policy.');
        process.exit();
    }
    // Exit if no Glboal Security Filter.
    // This filter is used anytime a policy
    // value is set to "false".
    if (!securityFilter) {
        facile.log.error('Security risk detected, please define a global security filter in "config.routes.securityFilter".');
        process.exit();
    }
    // Resolve Secrity filter if string.
    if (lodash_1.isString(securityFilter))
        securityFilterNormalized = lookupFilter(securityFilter, filterCol);
    // Normalize Global Policy.
    globalPolNormalized = normalizeFilters(globalPol);
    // Lookup a filter method from string.
    function lookupFilter(filter, collection) {
        var arr = filter.split('.');
        var name = arr[0];
        var action = arr[1];
        var klass = collection.get(name);
        return function (req, res, next) {
            klass[action](req, res, next);
        };
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
                    _normalized.push(securityFilterNormalized);
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
        var ctrlName = handler.split('.').shift();
        var rawFilters = lodash_1.get(policies, handler);
        var ctrlGlobalPol = lodash_1.get(policies, ctrlName + '.*');
        var ctrlGlobalPols;
        var actionFilters;
        var result;
        if (ctrlPols[ctrlName] && ctrlPols[ctrlName]['*'])
            ctrlGlobalPols = ctrlPols[ctrlName]['*'];
        else if (ctrlGlobalPol)
            ctrlGlobalPols = normalizeFilters(ctrlGlobalPol);
        if (ctrlGlobalPols && ctrlGlobalPols.length) {
            ctrlPols[ctrlName] = ctrlPols[ctrlName] || {};
            ctrlPols[ctrlName]['*'] = ctrlGlobalPols;
        }
        ctrlGlobalPols = ctrlGlobalPols || [];
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
            // Iterate and add routes.
            lodash_1.each(facile._routes, function (route) {
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