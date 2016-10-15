
import { extend as _extend, isPlainObject, max, keys,
				each, isString, isFunction, padEnd, truncate as _truncate } from 'lodash';
import { IFacile, IRoute, IRequestHandler } from '../interfaces';

/**
 * Add object to mapped collection.
 *
 * @method extendMap
 * @memberOf utils
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
	else if (key.constructor || (Array.isArray(key) && key[0])) {

		if (Array.isArray(key)) {
			key.forEach((klass) => {
				let name = constructorName(klass);
				obj[name] = klass;
			});
		}

		else {
			let name = constructorName(key);
			obj[name] = key;
		}

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
 * Gets max value in object
 * of objects by property.
 *
 * @method maxIn
 * @memberOf utils
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
 * @method hasIn
 * @memberOf utils
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
 * @method parseRoute
 * @memberOf utils
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
 * @method validateRoute
 * @memberOf utils
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
			methods.push(m.toLowerCase());
		});
		route.method = methods;
	}

	// Otherwise normalize single method.
	else {
		let method: string = route.method as string;
		route.method = [route.method.toLowerCase()];
	}

	// Ensure default router.
	route.router = route.router || 'default';

	// Ensure filters array.
	route.filters = route.filters || [];

	// Mehod, Handler and Url path are required.
	if (!route.method || !route.handler || !route.url)
		route.valid = false;

	return route;

}

/**
 * Function for non operation.
 *
 * @method noop
 * @memberOf utils
 * @export
 */
export function noop () {}

/**
 * Truncates a string using lodash _.truncate
 *
 * @method truncate
 * @memberOf utils
 * @export
 * @param {string} str
 * @param {number} length
 * @param {string} [omission='...']
 * @returns {string}
 */
export function truncate(str: string, length: number, omission: string = '...'): string {
	return _truncate(str, {
		length: length,
		omission: omission,
		separator: ' '
	});
}

/**
 * Gets constructor name with
 * fallback to function name
 * probably overkill.
 *
 * @method constructorName
 * @memberOf utils
 * @export
 * @param {Function} fn
 * @returns {string}
 */
export function constructorName(fn: Function) {
	if (fn.constructor && fn.constructor.name) {
		let result = fn.constructor.name;
		if (result === 'Function')
			result = functionName(fn);
		return result;
	}
	else {
		return functionName(fn);
	}
}

/**
 * Gets function name.
 *
 * @method functionName
 * @memberOf utils
 * @export
 * @param {Function} fn
 * @returns {string}
 */
export function functionName(fn: Function): string {

	// Match:
	// - ^          the beginning of the string
	// - function   the word 'function'
	// - \s+        at least some white space
	// - ([\w\$]+)  capture one or more valid JavaScript identifier characters
	// - \s*        optionally followed by white space (in theory there won't be any here,
	//              so if performance is an issue this can be omitted[1]
	// - \(         followed by an opening brace
	//

	let result = /^function\s+([\w\$]+)\s*\(/.exec(fn.toString());

	// Ignores match on anonymous functions.
	return  result  ?  result[ 1 ]  :  '';

}
