
import { extend as _extend, isPlainObject } from 'lodash';

/**
 * Helper method adds to specified map.
 *
 * @export
 * @param {*} key
 * @param {*} val
 * @param {*} obj
 */
export function addType(key: any, val: any, obj: any) {
	if (typeof key === 'string')
		obj[key] = val;
	else
		Object.keys(key).forEach((k) => {
			obj[k] = key[k];
		});
}

/**
 * Wrapper for lodash extend
 * merely for convenience.
 *
 * @export
 * @param {...any[]} args
 * @returns
 */
export function extend(...args: any[]) {
	return _extend.apply(null, args);
}

/**
 * Gets max value in object
 * of objects by property.
 *
 * @export
 * @param {*} obj
 * @param {string} key
 * @returns {number}
 */
export function maxIn(obj: any, key: string): number {
	return _.max(_.keys(obj).map((k) => {
		return obj[k][key];
	}));
}

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
export function hasIn(obj: any, key: any, val: any): boolean {
	let filter: any = {};
	filter[key] = val;
	if (isPlainObject(key))
		filter = key;
	return _.some(obj, filter);
}

/**
 * Function for non operation.
 *
 * @export
 */
export function noop () {}

