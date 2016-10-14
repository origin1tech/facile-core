import { IFacile, IInit, IRoute } from '../interfaces';
import { Facile } from './';
import { each } from 'lodash';
import { Router } from 'express';

export function init(facile: Facile): any {

	return (fn?: Function): IInit => {

		function handleRoutes() {

			facile.logger.debug('Initializing Routes');

			// Iterate and add routes.
			each(facile._routes, (route: IRoute) => {

				let router: Router = facile.router(route.router);
				let methods = route.method as string[];


			});

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