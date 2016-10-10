import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Filters
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	that.logger.debug('Initializing Filters');

	that.emit('init:filters');

	return that.init();

}