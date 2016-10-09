"use strict";
var lodash_1 = require('lodash');
/**
 * Add object to mapped collection.
 *
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
 * Wrapper for lodash extend
 * merely for convenience.
 *
 * @export
 * @param {...any[]} args
 * @returns {*}
 */
function extend() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return lodash_1.extend.apply(null, args);
}
exports.extend = extend;
/**
 * Gets max value in object
 * of objects by property.
 *
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
function validateRoute(route) {
    route.method = route.method || 'GET';
}
exports.validateRoute = validateRoute;
/**
 * Function for non operation.
 *
 * @export
 */
function noop() { }
exports.noop = noop;
//# sourceMappingURL=utils.js.map