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
    // key and value provided.
    if (typeof key === 'string') {
        obj[key] = val;
    }
    else {
        Object.keys(key).forEach(function (k) {
            obj[k] = key[k];
        });
    }
}
exports.extendMap = extendMap;
function extendType(Type, obj, instance) {
    // A class object provided.
    if (Type.constructor && Type.constructor.name) {
        if (instance)
            obj[Type.constructor.name] = new Type(instance);
        else
            obj[Type.constructor.name] = Type;
    }
    else if (Array.isArray(Type)) {
        Type.forEach(function (T) {
            if (instance)
                obj[T.constructor.name] = new T(instance);
            else
                obj[T.constructor.name] = T;
        });
    }
}
exports.extendType = extendType;
/**
 * Wrapper for lodash extend
 * merely for convenience.
 *
 * @export
 * @param {...any[]} args
 * @returns
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
/**
 * Function for non operation.
 *
 * @export
 */
function noop() { }
exports.noop = noop;
//# sourceMappingURL=utils.js.map