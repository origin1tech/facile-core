import { IFacile, IInit, IRoute, IRequest, IResponse, INextFunction, IController, IFilter, IRequestHandler, ICallback, ICallbackResult } from '../interfaces';
import { Facile } from './';
import { Collection } from './collection';
import { each, isString, isBoolean, isFunction, get, flattenDeep, bind, functions, sortBy, orderBy } from 'lodash';
import { Router } from 'express';

export function init(facile: Facile): any {

	// Get Controllers Collection.
	let ctrlCol: Collection<IController> = facile._controllers;

	// Get Filters Collection.
	let filterCol: Collection<IController> = facile._filters;

	// Get all policies.
	let policies = facile._policies;

	// Get the global policy.
	let globalPol = policies['*'];

	// Routes configuration.
	let routesConfig = facile._config.routes;

	// Get the global security filter.
	let securityFilter = routesConfig.handlers && routesConfig.handlers.security;

	// Map of cached global controller policies.
	let ctrlPols: any = {};

	// Global Policy should always be defined.
	if (globalPol === undefined) {
		facile.log.error('Security risk detected, please define a global policy.');
		process.exit();
	}

	// Lookup a action method from string.
	function lookupAction(action: string, collection: any, route?: IRoute): IRequestHandler {

		facile.log.debug('Looking up route action "' + action + '".');

		let klassName = action.split('.').shift();
		let klass = collection.get(klassName);
		let klassAction = get(collection._components, action) as IRequestHandler;

		if (!klassAction)
			return undefined;

		// Check if action is view or redirect.
		if (route && (route.view || route.redirect)) {
			return klassAction.bind(klass, route.view || route.redirect)();
		}

		// Bind to class so we don't lose context.
		return klassAction.bind(klass);

	}

	// Normalize all filters looking
	// up or setting to global security filter.
	function normalizeFilters(filters: any, ctrl?: boolean, route?: IRoute): IRequestHandler[] {

		let lookupType = ctrl ? 'controller' : 'filter';
		let _normalized = [];

		// Ensure filters are an array.
		if (!Array.isArray(filters))
			filters = [filters];

		// Just return if empty array.
		if (!filters.length)
			return [];

		// Iterate the array and normalize to
		// request handlers.
		filters.forEach((f, i) => {

			if (f === undefined)
				return;

			// If function just push to normalized array.
			if (isFunction(f)) {
				return _normalized.push(f);
			}

			// If boolean and true use global security filter.
			else if (isBoolean(f) && !ctrl) {

				// Only normalize if true.
				// if false skip.
				if (f === false) {
					if (isFunction(securityFilter)) {
						_normalized.push(securityFilter);
					}
					else {
						let action = lookupAction(securityFilter as string, filterCol);
						if (action)
							_normalized.push(action);
						else
							facile.log.warn('Failed to load ' + lookupType + ' the filter/action "' + securityFilter + '" could not be resolved.');
					}
				}

			}

			// If string use dot notaion and lookup.
			else if (isString(f)) {

				// May be in filters or controllers.
				let collection = ctrl ? ctrlCol : filterCol;

				let action = lookupAction(f, collection, route);

				if (action) {
					_normalized.push(action);
				}
				else {
					facile.log.warn('Failed to load ' + lookupType + ' the filter/action "' + f + '" could not be resolved.');
				}

			}

			// Warn of invalid filter type.
			else {

				let validTypes = ctrl ? 'string or function' : 'string, boolean or function';

				facile.log.warn('Failed to normalize ' + lookupType + ' expected ' + validTypes + ' but got "' + typeof f + '".');

				// If not development exit to
				// ensure production app is not
				// served with broken filters.
				if (facile._config.env !== 'development')
					process.exit();
			}

		});

		return _normalized;

	}

	// Lookup policies by ctrl
	// name and action name.
	function lookupPolicies(handler: string): IRequestHandler[] {

		facile.log.debug('Looking up security policy/filters for route hanlder "' + handler + '".');

		let globalPolNormalized;
		let ctrlName: string = handler.split('.').shift();
		let rawFilters = get(policies, handler);
		let ctrlGlobalPol = get(policies, ctrlName + '.*');
		let ctrlGlobalPols;
		let actionFilters;
		let result;

		globalPolNormalized = normalizeFilters(globalPol);

		if (ctrlPols[ctrlName] && ctrlPols[ctrlName]['*'])
			ctrlGlobalPols = ctrlPols[ctrlName]['*'];
		else if (ctrlGlobalPol)
			ctrlGlobalPols = normalizeFilters(ctrlGlobalPol);

		if (ctrlGlobalPols && ctrlGlobalPols.length) {
			ctrlPols[ctrlName] = ctrlPols[ctrlName] || {};
			ctrlPols[ctrlName]['*'] = ctrlGlobalPols;
		}

		// Ensure Global Policy is array.
		ctrlGlobalPols = ctrlGlobalPols || [];

		// Get the normalized filters.
		result = normalizeFilters(rawFilters);

		// Set pols to controller global
		// if no handler filer.
		if (!result.length)
			result = ctrlGlobalPols;

		// Check global policies.
		// Always cascade global.
		result = globalPolNormalized.concat(result || []);

		return result;

	}

	// Checks if route handler is view or redirect
	// then normalizes and returns.
	function normalizeViewRedirect(route: IRoute): IRoute {
		if (route.handler === 'view' || route.handler === 'redirect')
			route.handler = routesConfig.handlers[route.handler];
		return route;
	}

	// Looks up filters and controller
	// normalizing as Express handers.
	function addRoute(route: IRoute) {

		let router: Router = facile.router(route.router);
		let methods = route.method as string[];

		// Normalize view and redirects.
		route = normalizeViewRedirect(route);

		let _policies: IRequestHandler[] = lookupPolicies(route.handler as string);
		let _filters: IRequestHandler[] = normalizeFilters(route.filters);
		let _handler: IRequestHandler[] = normalizeFilters(route.handler, true, route);
		let _handlers: IRequestHandler[] = _policies.concat(_filters).concat(_handler);

		// Iterate adding handlers
		// for each method.
		if (!_handler.length || !_handlers.length)
			return facile.log.warn('Failed to initialize route "' + route.url + '" invalid or missing handler.');

		let _route = router.route(route.url);

		methods.forEach((m) => {
			_route[m](_handlers);
		});

	}

	return (fn?: Function): IInit => {

		function handleRoutes() {

			facile.log.debug('Initializing Routes');

			let routes = facile._routes;
			let sortConfig = facile._config.routes.sort;

			// if route sorting is enabled
			// sort the routes.
			if (sortConfig !== false)
				routes = orderBy(routes, 'url', 'desc');

			// Iterate and add routes.
			each(routes, (route: IRoute) => {
				addRoute(route);
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