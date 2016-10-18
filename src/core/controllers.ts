import { IInit, IController } from '../interfaces';
import {  } from './utils';
import { Facile } from './';
import { Collection } from './collection';
import { each } from 'lodash';


export function init(facile: Facile): any {

	return (fn?: Function): IInit => {

		function handleControllers() {

			facile.log.debug('Initializing Controllers');

			let collection: Collection<IController> = facile._controllers;

			// Initialize the controllers.
			// passing in instance.
			collection.initAll(facile);

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