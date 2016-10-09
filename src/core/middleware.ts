import { IFacile } from '../interfaces';

/**
 * Initializes Middleware
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IFacile{

	this.logger.debug('Initializing Middleware');

	this.emit('middleware:init');

	return this;

}