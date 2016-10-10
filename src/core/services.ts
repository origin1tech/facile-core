import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Services
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	that.logger.debug('Initializing Services');

	that.emit('init:filters');

	return that.init();

}