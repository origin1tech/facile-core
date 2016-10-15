import { IFacile, IInit } from '../interfaces';
import { } from './utils';
import { Facile } from './';

export function init(facile: Facile): any {

	return (fn?: Function): IInit => {

		function handleServices(): IInit {

			facile.log.debug('Initializing Services');

			// Initialize the services.
			//initMap(facile._services, facile);


			if (facile._config.auto)
				facile.execAfter('init:services', () => {
					facile.emit('init:filters');
				});
			else if (fn)
				fn();
			else
				return facile.init();

		}

		if (facile._config.auto)
			facile.execBefore('init:services', () => {
				handleServices.call(facile);
			});
		else
			return handleServices.call(facile);

		};

}