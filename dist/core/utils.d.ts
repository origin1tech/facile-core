import { IRoute } from '../interfaces';
/**
 * Add object to mapped collection.
 *
 * @export
 * @param {*} key
 * @param {*} val
 * @param {*} [obj]
 */
export declare function extendMap(key: any, val: any, obj?: any): void;
/**
 * Extends object with supplied Type.
 *
 * @export
 * @param {*} Type
 * @param {*} obj
 * @param {IFacile} [instance]
 */
export declare function initMap(Type: any, obj: any, instance?: any): void;
/**
 * Wrapper for lodash extend
 * merely for convenience.
 *
 * @export
 * @param {...any[]} args
 * @returns {*}
 */
export declare function extend(...args: any[]): any;
/**
 * Gets max value in object
 * of objects by property.
 *
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
 * @export
 * @param {*} obj
 * @param {*} key
 * @param {*} val
 * @returns {boolean}
 */
export declare function hasIn(obj: any, key: any, val: any): boolean;
export declare function validateRoute(route: IRoute): void;
/**
 * Function for non operation.
 *
 * @export
 */
export declare function noop(): void;
