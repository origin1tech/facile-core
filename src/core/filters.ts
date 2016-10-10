import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Filters
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	function handleFilters() {

		that.logger.debug('Initializing Filters');

		// Init code here.

		if (that._config.auto)
			that.execAfter('init:filters', () => {
				that.emit('init:models');
			});
		else
			return that.init();

	}

	if (that._config.auto)
		that.execBefore('init:filters', () => {
			handleFilters();
		});
	else
		return handleFilters();

}