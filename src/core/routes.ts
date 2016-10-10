import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Routes
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	function handleRoutes() {

		that.logger.debug('Initializing Routes');

		// Init code here.

		if (that._config.auto)
			that.execAfter('init:routes', () => {
				that.emit('init:done');
			});
		else
			return that.init();

	}

	if (that._config.auto)
		that.execBefore('init:routes', () => {
			handleRoutes();
		});
	else
		return handleRoutes();

}