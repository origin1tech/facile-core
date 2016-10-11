import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Routes
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
export function init(fn?: Function): IInit {

	function handleRoutes() {

		this.logger.debug('Initializing Routes');

		// Init code here.

		if (this._config.auto)
			this.execAfter('init:routes', () => {
				this.emit('init:done');
			});
		else if (fn)
			fn();
		else
			return this._inits;

	}

	if (this._config.auto)
		this.execBefore('init:routes', () => {
			handleRoutes.call(this);
		});
	else
		return handleRoutes.call(this);

}