import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Controllers
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	that.logger.debug('Initializing Controllers');

	that.emit('init:routes');

	return that.init();

}