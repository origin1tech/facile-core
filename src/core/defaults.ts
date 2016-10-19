
import * as cons from 'consolidate';
import { join } from 'path';
import { IConfig } from '../interfaces';

export let packages: any = {
	pkg: require('../../package.json'),
	apppkg: require(join(process.cwd(), 'package.json'))
};

export let config: IConfig = {
	auto: undefined,
	cwd: process.cwd(),
	pkg: packages.apppkg,
	env: 'development',
	logLevel: 'debug',
	host: '127.0.0.1',
	port: 8080,
	maxConnections: 128,
	views: {
		layout: 'index',
		engine: 'ejs',
		// extension: 'ejs' // defaults to engine.
		views: '/'
	},
	routes: {
		handlers: {
			index: 'DefaultController.index',
			view: 'DefaultController.view',
			redirect: 'DefaultController.redirect',
			security: 'DefaultFilter.isAuthenticated'
		},
		rest: {
			controller: 'DefaultController',
			actions: {
				find: 			'get /api/{model}',
				findOne: 		'get /api/{model}/:id',
				create: 		'post /api/{model}',
				update: 		'put /api/{model}/:id',
				destroy: 		'del /api/{model}/:id'
			}
		},
		crud: {
			controller: 'DefaultController',
			actions: {
				find: 			'get /api/{model}/show',
				findOne: 		'get /api/{model}/show/:id',
				create: 		'post /api/{model}/create',
				update: 		'post /api/{model}/update/:id',
				destroy: 		'post /api/{model}/destroy/:id'
			}
		},
		sort: undefined
	}


};
