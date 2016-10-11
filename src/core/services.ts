import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Services
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
export function init(fn?: Function): IInit {

	function handleServices() {

		this.logger.debug('Initializing Services');

		// Init code here.

		if (this._config.auto)
			this.execAfter('init:services', () => {
				this.emit('init:filters');
			});
		else if (fn)
			fn();
		else
			return this._inits;


	}

	if (this._config.auto)
		this.execBefore('init:services', () => {
			handleServices.call(this);
		});
	else
		return handleServices.call(this);

}