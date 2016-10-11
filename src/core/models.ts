import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Models
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
export function init(fn?: Function): IInit {

	function handleModels() {

		this.logger.debug('Initializing Models');

		// Init code here.

		if (this._config.auto)
			this.execAfter('init:models', () => {
				this.emit('init:controllers');
			});
		else if (fn)
			fn();
		else
			return this._inits;

	}

	if (this._config.auto)
		this.execBefore('init:models', () => {
			handleModels.call(this);
		});
	else
		return handleModels.call(this);

}