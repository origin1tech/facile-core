import { IFacile } from '../interfaces';

/**
 * Initializes Server
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IFacile {

	this.logger.debug('Initializing Server');

	this.logger.debug('Ensuring default router.');

	// Ensure Routers exist.
	this._routers = this._routers || {};

	// Check for default router.
	if (!this._routers['default'])
		this._routers['default'] = this.app._router;

	this.emit('server:init');

	return this;

}