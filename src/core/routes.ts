import { IFacile, IInit, IRoute, IRequest, IResponse, INextFunction, IController, IFilter, IRequestHandler } from '../interfaces';
import { Facile } from './';
import { Collection } from './collection';
import { each, isString, isBoolean, isFunction, get, flattenDeep, bind, functions } from 'lodash';
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
	//let globalPolNormalized;

	// Get the global security filter.
	let securityFilter = facile._config.routes && facile._config.routes.securityFilter;
	//let securityFilterNormalized;

	// Map of cached global controller policies.
	let ctrlPols: any = {};

	// Global Policy should always be defined.
	if (globalPol === undefined) {
		facile.log.error('Security risk detected, please define a global policy.');
		process.exit();
	}

	// Resolve Secrity filter if string.
	//securityFilterNormalized = securityFilter;
	// if (isString(securityFilter))
	// 	securityFilterNormalized = lookupFilter(securityFilter, filterCol);

	// Exit if no Glboal Security Filter.
	// This filter is used anytime a policy
	// value is set to "false".
	// if (!isFunction(securityFilterNormalized)) {
	// 	facile.log.error('Security risk detected, security filter undefined or invalid type.');
	// 	process.exit();
	// }

	// Normalize Global Policy.
	//globalPolNormalized = normalizeFilters(globalPol);

	// Lookup a filter method from string.
	function lookupFilter(filter: string, collection: any): IRequestHandler {

		let arr = filter.split('.');
		let name = arr[0];
		let action = arr[1];
		let klass = collection.get(name);

		if (!klass)
			return undefined;

		return function (req, res, next) {
			klass[action](req, res, next);
		};

	}

	// Normalize all filters looking
	// up or setting to global security filter.
	function normalizeFilters(filters: any, ctrl?: boolean): IRequestHandler[] {

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
				if (f === false)
					_normalized.push(lookupFilter(securityFilter as string, filterCol));

			}

			// If string use dot notaion and lookup.
			else if (isString(f)) {

				// May be in filters or controllers.
				let collection = ctrl ? ctrlCol : filterCol;
				let filter = lookupFilter(f, collection);

				if (filter) {
					_normalized.push(filter);
				}
				else {
					facile.log.warn('Failed to load ' + lookupFilter + ' "' + f + '", ' + lookupFilter + ' could not be resolved.');
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
	function lookupPolicies(handler: string) {

		let globalPolNormalized;
		let ctrlName: string = handler.split('.').shift();
		let rawFilters = get(policies, handler);
		let ctrlGlobalPol = get(policies, ctrlName + '.*');
		let ctrlGlobalPols;
		let actionFilters;
		let result;

		globalPolNormalized = normalizeFilters(false);

		if (ctrlPols[ctrlName] && ctrlPols[ctrlName]['*'])
			ctrlGlobalPols = ctrlPols[ctrlName]['*'];
		else if (ctrlGlobalPol)
			ctrlGlobalPols = normalizeFilters(ctrlGlobalPol);

		if (ctrlGlobalPols && ctrlGlobalPols.length) {
			ctrlPols[ctrlName] = ctrlPols[ctrlName] || {};
			ctrlPols[ctrlName]['*'] = ctrlGlobalPols;
		}

		ctrlGlobalPols = ctrlGlobalPols || [];

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

	// Looks up filters and controller
	// normalizing as Express handers.
	function addRoute(route: IRoute) {

		let router: Router = facile.router(route.router);
		let methods = route.method as string[];
		let _route = router.route(route.url);
		let _policies: IRequestHandler[] = lookupPolicies(route.handler as string);
		let _filters: IRequestHandler[] = normalizeFilters(route.filters);
		let _handler: IRequestHandler[] = normalizeFilters(route.handler, true);
		let _handlers: IRequestHandler[] = _policies.concat(_filters).concat(_handler);

		// Iterate adding handlers
		// for each method.
		methods.forEach((m) => {
			if (!_handlers || !_handlers.length)
				return facile.log.warn('Failed to initialize route "' + route.url + '" invalid or missing handler.');
			_route[m](_handlers);
		});

	}

	return (fn?: Function): IInit => {

		function handleRoutes() {

			facile.log.debug('Initializing Routes');

			// Iterate and add routes.
			each(facile._routes, (route: IRoute) => {
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