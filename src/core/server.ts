import { IFacile, IInit } from '../interfaces';
import { each, sortBy } from 'lodash';

/**
 * Initializes Server
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	that.logger.debug('Ensuring default router.');

	// Ensure Routers exist.
	that._routers = that._routers || {};

	// Check for default router.
	if (!that._routers['default'])
		that._routers['default'] = that.app._router;

	// Sort & Iterate Middleware.
	that.logger.debug('Initializing middleware.');
	this._middlewares = sortBy(this._middlewares, 'order');
	each(this._middlewares, (v, k) => {
		that.app.use(v.fn);
	});

	that.emit('init:services');

	return that.init();

}