"use strict";
var lodash_1 = require('lodash');
/**
 * Helper method adds to specified map.
 *
 * @export
 * @param {*} key
 * @param {*} val
 * @param {*} obj
 */
function addType(key, val, obj) {
    if (typeof key === 'string')
        obj[key] = val;
    else
        Object.keys(key).forEach(function (k) {
            obj[k] = key[k];
        });
}
exports.addType = addType;
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
    return _.max(_.keys(obj).map(function (k) {
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