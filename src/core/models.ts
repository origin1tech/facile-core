import { IFacile } from '../interfaces';

/**
 * Initializes Models
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IFacile {

	this.logger.debug('Initializing Models');

	this.emit('models:init');

	return this;

}