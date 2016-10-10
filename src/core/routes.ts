import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Routes
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	that.logger.debug('Initializing Routes');

	that.emit('init:done');

	return that.init();

}