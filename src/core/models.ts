import { IInit, IModel, IRoute, IRoutes, IRoutesTemplate } from '../interfaces';
import { each, some, isString } from 'lodash';
import { Facile } from './';
import { parseRoute } from './utils';
import { Collection } from './collection';

export function init(facile: Facile): any {

	let routes = facile._routes;

	// Helper to detect if url exists.
	function routeExists(url) {
		return some(routes, { url: url });
	}

	return (fn?: Function): IInit => {

		function handleModels() {

			facile.log.debug('Initializing Models');

			let collection: Collection<IModel> = facile._models;

			// Initialize the Models.
			collection.initAll(facile);

			// Check for route generation.
			if (facile._config.routes) {

				let models = collection.getAll();
				let routesConfig = facile._config.routes;

				// Need to case config types because
				// could be passed as boolean during configure.
				let restConfig = routesConfig.rest as IRoutesTemplate;
				let crudConfig = routesConfig.crud as IRoutesTemplate;
				let restCtrl = restConfig.controller;
				let crudCtrl = crudConfig.controller;

				each(models, (model, name) => {

					let normalName = name.replace(/model$/gi, '').toLowerCase();

					if (restConfig) {
						each(restConfig.actions, (url, action) => {
							url = url.replace(/{model}/gi, normalName);
							if (!routeExists(url)) {
								let _route = parseRoute(url, {
									handler: `${restCtrl}.${action}`,
									model: model
								});
								facile.registerRoute(_route);
							}
						});
					}

					if (crudConfig) {
						each(crudConfig.actions, (url, action) => {
							url = url.replace(/{model}/gi, normalName);
							if (!routeExists(url)) {
								let _route = parseRoute(url, {
									handler: `${crudCtrl}.${action}`,
									model: model
								});
								facile.registerRoute(_route);
							}
						});
					}

				});

			}

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