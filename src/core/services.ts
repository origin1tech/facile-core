import { IFacile } from '../interfaces';

/**
 * Initializes Services
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IFacile {

	this.logger.debug('Initializing Services');

	this.emit('services:init');

	return this;

}