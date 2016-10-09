import { IFacile } from '../interfaces';

/**
 * Initializes Routes
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IFacile {

	this.logger.debug('Initializing Routes');

	this.emit('routes:init');

	return this;

}