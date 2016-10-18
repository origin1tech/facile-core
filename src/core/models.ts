import { IInit, IModel } from '../interfaces';
import {  } from './utils';
import { Facile } from './';
import { Collection } from './collection';

export function init(facile: Facile): any {

	return (fn?: Function): IInit => {

		function handleModels() {

			facile.log.debug('Initializing Models');

			let collection: Collection<IModel> = facile._models;

			// Initialize the Models.
			collection.initAll(facile);

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