import { IInit, IFilter } from '../interfaces';
import {  } from './utils';
import { Facile } from './';
import { Collection } from './collection';


export function init(facile: Facile): any {

	return (fn?: Function): IInit => {

		function handleFilters() {

			facile.log.debug('Initializing Filters');

			// Initialize the filters.
			
			let collection: Collection<IFilter> = facile._filters;

			// Initialize the controllers.
			// passing in instance.
			collection.initAll(facile);	

			if (facile._config.auto)
				facile.execAfter('init:filters', () => {
					facile.emit('init:models');
				});
			else if (fn)
				fn();
			else
				return facile.init();

		}

		if (facile._config.auto)
			facile.execBefore('init:filters', () => {
				handleFilters.call(facile);
			});
		else
			return handleFilters.call(facile);

	};

}