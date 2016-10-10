
import { extend as _extend, isPlainObject, max, keys, each, isString, isFunction } from 'lodash';
import { IFacile, IRoute, IRequestHandler } from '../interfaces';

/**
 * Add object to mapped collection.
 *
 * @export
 * @param {*} key
 * @param {*} val
 * @param {*} [obj]
 */
export function extendMap(key: any, val: any, obj?: any) {

	// Allow map object as second arg.
	if (!obj) {
		obj = val;
		val = undefined;
	}

	// key and value provided.
	if (isString(key) && val !== undefined) {
		obj[key] = val;
	}

	// Check if is class with construtor
	// or Array of class object.
	else if (key.constructor || (Array.isArray(key) && key[0] && key[0].constructor)) {

		if (Array.isArray(key))
			key.forEach((klass) => {
				obj[klass.constructor.name] = klass;
			});

		else
			obj[key.constructor.name] = key;

	}

	// Map with name and object provided.
	else if (isPlainObject(key)) {
		Object.keys(key).forEach((k) => {
			obj[k] = key[k];
		});
	}

	else {
		throw new Error('Failed to extend map, invalid configuration.');
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
export function initMap(Type: any, obj: any, instance?: any) {

	// Check if map instead of single
	// class was provided.
	if (!instance) {
		instance = obj;
		obj = Type;
		Type = undefined;
	}

	// Instantiate class and update in map.
	if (Type) {
		let name = Type.constructor.name;
		obj[name] = new Type(instance);
	}

	// Otherwise iterate and instantiate all.
	else {
		each(obj, (T, k) => {
			obj[k] = new T(instance);
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
 * Parses a key/value Route.
 * When using IRoutesMap the
 * url needs to be parsed into
 * an IRoute configuration.
 *
 * @export
 * @param {string} url
 * @param {(IRequestHandler | Array<IRequestHandler> | string | IRoute)} handler
 * @returns {IRoute}
 */
export function parseRoute(url: string,
													handler: IRequestHandler | Array<IRequestHandler> | string | IRoute): IRoute {

	let route: IRoute;

	let arr = url.trim().split(' ');
	if (arr.length === 1)
		arr.unshift('get');

	route = {
		method: arr[0],
		url: arr[1]
	};

	// If handler is Route object extend it.
	if (isPlainObject(handler)) {
		route = _extend({}, route, handler);
	}
	// Set last handler as primary handler
	// set others to filters property.
	else if (Array.isArray(handler)) {
		let last = handler.pop();
		route.handler = last;
		route.filters = handler;
	}
	else {
		route.handler = handler as IRequestHandler;
	}

	return route;

}

/**
 * Validates Route configuration.
 * When invalid route.valid will
 * equal false.
 *
 * @export
 * @param {IRoute} route
 * @returns {IRoute}
 */
export function validateRoute(route: IRoute): IRoute {

	route.valid = true;

	// Normalize if method is array.
	if (Array.isArray(route.method)) {
		let methods = [];
		route.method.forEach((m, k) => {
			methods.push(m.toUpperCase());
		});
		route.method = methods;
	}

	// Otherwise normalize single method.
	else {
		let method: string = route.method as string;
		route.method = (method || 'GET').toUpperCase();
	}

	// Ensure default router.
	route.router = route.router || 'default';

	// Mehod, Handler and Url path are required.
	if (!route.method || !route.handler || !route.url)
		route.valid = false;


	return route;

}

/**
 * Function for non operation.
 *
 * @export
 */
export function noop () {}

