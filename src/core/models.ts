import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Models
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	that.logger.debug('Initializing Models');

	that.emit('init:controllers');

	return that.init();

}