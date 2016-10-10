import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Services
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	function handleServices() {

		that.logger.debug('Initializing Services');

		// Init code here.

		if (that._config.auto)
			that.execAfter('init:services', () => {
				that.emit('init:filters');
			});
		else
			return that.init();

	}

	if (that._config.auto)
		that.execBefore('init:services', () => {
			handleServices();
		});
	else
		return handleServices();

}