import { IFacile } from '../interfaces';

/**
 * Initializes Controllers
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IFacile {

	this.logger.debug('Initializing Controllers');

	this.emit('controllers:init');

	return this;

}