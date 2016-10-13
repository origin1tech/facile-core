import { IFacile, IInit } from '../interfaces';
import { Facile } from './';
import { each } from 'lodash';

export function init(facile: Facile): any {

	return (fn?: Function): IInit => {

		function handleRoutes() {

			facile.logger.debug('Initializing Routes');

			// each(facile._routes, (route) => {
			// 	console.log(route);
			// });

			if (facile._config.auto)
				facile.execAfter('init:routes', () => {
					facile.emit('init:done');
				});
			else if (fn)
				fn();
			else
				return facile.init();

		}

	if (facile._config.auto)
		facile.execBefore('init:routes', () => {
			handleRoutes.call(facile);
		});
	else
		return handleRoutes.call(facile);

	};

}