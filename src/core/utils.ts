
import { extend as _extend, isPlainObject, max, keys} from 'lodash';
import { IFacile } from '../interfaces';

/**
 * Add object to mapped collection.
 *
 * @export
 * @param {*} key
 * @param {*} val
 * @param {*} [obj]
 */
export function extendMap(key: any, val: any, obj: any) {

	// key and value provided.
	if (typeof key === 'string') {
		obj[key] = val;
	}

	// Map with name and object provided.
	else {
		Object.keys(key).forEach((k) => {
			obj[k] = key[k];
		});
	}

}

/**
 * Extends object with supplied Type.
 *
 * @export
 * @param {*} Type
 * @param {*} obj
 * @param {IFacile} [instance]
 */
export function extendType(Type: any, obj: any, instance?: IFacile) {

	// A class object provided.
	if (Type.constructor && Type.constructor.name) {
		if (instance)
			obj[Type.constructor.name] = new Type(instance);
		else
			obj[Type.constructor.name] = Type;
	}

	// Array of class objects provided.
	else if (Array.isArray(Type)) {
		Type.forEach((T) => {
			if (instance)
				obj[T.constructor.name] = new T(instance);
			else
				obj[T.constructor.name] = T;
		});
	}

}

/**
 * Wrapper for lodash extend
 * merely for convenience.
 *
 * @export
 * @param {...any[]} args
 * @returns {*}
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
	return max(keys(obj).map((k) => {
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

