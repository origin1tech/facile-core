import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Controllers
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
export function init(fn?: Function): IInit {

	function handleControllers() {

		this.logger.debug('Initializing Controllers');

		// Init code here.

		if (this._config.auto)
			this.execAfter('init:controllers', () => {
				this.emit('init:routes');
			});
		else if (fn)
			fn();
		else
			return this._inits;

	}

	if (this._config.auto)
		this.execBefore('init:controllers', () => {
			handleControllers.call(this);
		});
	else
		return handleControllers.call(this);

}