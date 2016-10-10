import { IRoute, IRequestHandler } from '../interfaces';
/**
 * Add object to mapped collection.
 *
 * @member utils
 * @export
 * @param {*} key
 * @param {*} val
 * @param {*} [obj]
 */
export declare function extendMap(key: any, val: any, obj?: any): void;
/**
 * Extends object with supplied Type.
 *
 * @member utils
 * @export
 * @param {*} Type
 * @param {*} obj
 * @param {IFacile} [instance]
 */
export declare function initMap(Type: any, obj: any, instance?: any): void;
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
export declare function maxIn(obj: any, key: string): number;
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
export declare function hasIn(obj: any, key: any, val: any): boolean;
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
export declare function parseRoute(url: string, handler: IRequestHandler | Array<IRequestHandler> | string | IRoute): IRoute;
/**
 * Validates Route configuration.
 * When invalid route.valid will
 * equal false.
 * @member utils
 * @export
 * @param {IRoute} route
 * @returns {IRoute}
 */
export declare function validateRoute(route: IRoute): IRoute;
/**
 * Function for non operation.
 *
 * @member utils
 * @export
 */
export declare function noop(): void;
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
export declare function truncate(str: string, length: number, omission?: string): string;
/**
 * Gets function name.
 *
 * @member utils
 * @export
 * @param {Function} fn
 * @returns {string}
 */
export declare function functionName(fn: Function): string;
