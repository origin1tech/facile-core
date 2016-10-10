import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Controllers
 *
 * @method
 * @export
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	function handleControllers() {

		that.logger.debug('Initializing Controllers');

		// Init code here.

		if (that._config.auto)
			that.execAfter('init:controllers', () => {
				that.emit('init:routes');
			});
		else
			return that.init();

	}

	if (that._config.auto)
		that.execBefore('init:controllers', () => {
			handleControllers();
		});
	else
		return handleControllers();

}