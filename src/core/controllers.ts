import { IInit } from '../interfaces';
import {  } from './utils';
import { Facile } from './';
import { each } from 'lodash';


export function init(facile: Facile): any {

	return (fn?: Function): IInit => {

		function handleControllers() {

			facile.logger.debug('Initializing Controllers');

			// Initialize the controllers.
			// each(facile._controllers, (Ctrl, key) => {
			// 	facile._controllers[key] = new Ctrl(facile);
			// });

			if (facile._config.auto)
				facile.execAfter('init:controllers', () => {
					facile.emit('init:routes');
				});
			else if (fn)
				fn();
			else
				return facile.init();

		}

		if (facile._config.auto)
			facile.execBefore('init:controllers', () => {
				handleControllers.call(facile);
			});
		else
			return handleControllers.call(facile);
		};

}