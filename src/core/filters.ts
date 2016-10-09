import { IFacile } from '../interfaces';

/**
 * Initializes Filters
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IFacile {

	this.logger.debug('Initializing Filters');

	this.emit('filters:init');

	return this;

}