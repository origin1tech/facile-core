import { IInit } from '../interfaces';
import {  } from './utils';
import { Facile } from './';

export function init(facile: Facile): any {

	return (fn?: Function): IInit => {

		function handleModels() {

			facile.logger.debug('Initializing Models');

			// Initialize the services.
			// initMap(facile._models, facile);

			if (facile._config.auto)
				facile.execAfter('init:models', () => {
					facile.emit('init:controllers');
				});
			else if (fn)
				fn();
			else
				return facile.init();

		}

	if (facile._config.auto)
		facile.execBefore('init:models', () => {
			handleModels.call(facile);
		});
	else
		return handleModels.call(facile);

	};

}