import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Filters
 *
 * @export
 * @param {Function} [fn]
 * @returns {IFacile}
 */
export function init(fn?: Function): IInit {

	function handleFilters() {

		this.logger.debug('Initializing Filters');

		// Init code here.

		if (this._config.auto)
			this.execAfter('init:filters', () => {
				this.emit('init:models');
			});
		else if (fn)
			fn();
		else {
			console.log('hit3');
			return this._inits;
		}

	}

	if (this._config.auto)
		this.execBefore('init:filters', () => {
			handleFilters.call(this);
		});
	else
		return handleFilters.call(this);

}