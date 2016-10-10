import { IFacile, IInit } from '../interfaces';

/**
 * Initializes Models
 *
 * @export
 * @returns {IFacile}
 */
export function init(): IInit {

	let that: IFacile = this;

	function handleModels() {

		that.logger.debug('Initializing Models');

		// Init code here.

		if (that._config.auto)
			that.execAfter('init:models', () => {
				that.emit('init:controllers');
			});
		else
			return that.init();

	}

	if (that._config.auto)
		that.execBefore('init:models', () => {
			handleModels();
		});
	else
		return handleModels();

}