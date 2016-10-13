import { IInit } from '../interfaces';
import {  } from './utils';
import { Facile } from './';


export function init(facile: Facile): any {

	return (fn?: Function): IInit => {

		function handleFilters() {

			facile.logger.debug('Initializing Filters');

			// Initialize the filters.
			// initMap(facile._filters, facile);

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