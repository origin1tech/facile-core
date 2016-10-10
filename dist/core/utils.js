"use strict";
var lodash_1 = require('lodash');
/**
 * Add object to mapped collection.
 *
 * @member utils
 * @export
 * @param {*} key
 * @param {*} val
 * @param {*} [obj]
 */
function extendMap(key, val, obj) {
    // Allow map object as second arg.
    if (!obj) {
        obj = val;
        val = undefined;
    }
    // key and value provided.
    if (lodash_1.isString(key) && val !== undefined) {
        obj[key] = val;
    }
    else if (key.constructor || (Array.isArray(key) && key[0] && key[0].constructor)) {
        if (Array.isArray(key))
            key.forEach(function (klass) {
                obj[klass.constructor.name] = klass;
            });
        else
            obj[key.constructor.name] = key;
    }
    else if (lodash_1.isPlainObject(key)) {
        Object.keys(key).forEach(function (k) {
            obj[k] = key[k];
        });
    }
    else {
        throw new Error('Failed to extend map, invalid configuration.');
    }
}
exports.extendMap = extendMap;
/**
 * Extends object with supplied Type.
 *
 * @member utils
 * @export
 * @param {*} Type
 * @param {*} obj
 * @param {IFacile} [instance]
 */
function initMap(Type, obj, instance) {
    // Check if map instead of single
    // class was provided.
    if (!instance) {
        instance = obj;
        obj = Type;
        Type = undefined;
    }
    // Instantiate class and update in map.
    if (Type) {
        var name = Type.constructor.name;
        obj[name] = new Type(instance);
    }
    else {
        lodash_1.each(obj, function (T, k) {
            obj[k] = new T(instance);
        });
    }
}
exports.initMap = initMap;
/**
 * Gets max value in object
 * of objects by property.
 *
 * @member utils
 * @export
 * @param {*} obj
 * @param {string} key
 * @returns {number}
 */
function maxIn(obj, key) {
    return lodash_1.max(lodash_1.keys(obj).map(function (k) {
        return obj[k][key];
    }));
}
exports.maxIn = maxIn;
/**
 * Checks if object contains
 * property with value.
 *
 * @member utils
 * @export
 * @param {*} obj
 * @param {*} key
 * @param {*} val
 * @returns {boolean}
 */
function hasIn(obj, key, val) {
    var filter = {};
    filter[key] = val;
    if (lodash_1.isPlainObject(key))
        filter = key;
    return _.some(obj, filter);
}
exports.hasIn = hasIn;
/**
 * Parses a key/value Route.
 * When using IRoutesMap the
 * url needs to be parsed into
 * an IRoute configuration.
 *
 * @member utils
 * @export
 * @param {string} url
 * @param {(IRequestHandler | Array<IRequestHandler> | string | IRoute)} handler
 * @returns {IRoute}
 */
function parseRoute(url, handler) {
    var route;
    var arr = url.trim().split(' ');
    if (arr.length === 1)
        arr.unshift('get');
    route = {
        method: arr[0],
        url: arr[1]
    };
    // If handler is Route object extend it.
    if (lodash_1.isPlainObject(handler)) {
        route = lodash_1.extend({}, route, handler);
    }
    else if (Array.isArray(handler)) {
        var last = handler.pop();
        route.handler = last;
        route.filters = handler;
    }
    else {
        route.handler = handler;
    }
    return route;
}
exports.parseRoute = parseRoute;
/**
 * Validates Route configuration.
 * When invalid route.valid will
 * equal false.
 * @member utils
 * @export
 * @param {IRoute} route
 * @returns {IRoute}
 */
function validateRoute(route) {
    route.valid = true;
    // Normalize if method is array.
    if (Array.isArray(route.method)) {
        var methods_1 = [];
        route.method.forEach(function (m, k) {
            methods_1.push(m.toUpperCase());
        });
        route.method = methods_1;
    }
    else {
        var method = route.method;
        route.method = (method || 'GET').toUpperCase();
    }
    // Ensure default router.
    route.router = route.router || 'default';
    // Mehod, Handler and Url path are required.
    if (!route.method || !route.handler || !route.url)
        route.valid = false;
    return route;
}
exports.validateRoute = validateRoute;
/**
 * Function for non operation.
 *
 * @member utils
 * @export
 */
function noop() { }
exports.noop = noop;
/**
 * Truncates a string using lodash _.truncate
 *
 * @member utils
 * @export
 * @param {string} str
 * @param {number} length
 * @param {string} [omission='...']
 * @returns {string}
 */
function truncate(str, length, omission) {
    if (omission === void 0) { omission = '...'; }
    return lodash_1.truncate(str, {
        length: length,
        omission: omission,
        separator: ' '
    });
}
exports.truncate = truncate;
/**
 * Gets function name.
 *
 * @member utils
 * @export
 * @param {Function} fn
 * @returns {string}
 */
function functionName(fn) {
    // Match:
    // - ^          the beginning of the string
    // - function   the word 'function'
    // - \s+        at least some white space
    // - ([\w\$]+)  capture one or more valid JavaScript identifier characters
    // - \s*        optionally followed by white space (in theory there won't be any here,
    //              so if performance is an issue this can be omitted[1]
    // - \(         followed by an opening brace
    //
    var result = /^function\s+([\w\$]+)\s*\(/.exec(fn.toString());
    // Ignores match on anonymous functions.
    return result ? result[1] : '';
}
exports.functionName = functionName;
//# sourceMappingURL=utils.js.map