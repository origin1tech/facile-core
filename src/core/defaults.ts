
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
		engine: {
			name: 'ejs',
			renderer: cons.ejs
		},
		views: '/'
	},
	// Set to false to disable.
	routes: {
		controller: 'DefaultController',
		securityFilter: 'DefaultFilter.isAuthenticated',
		// When defined rest routes created.
		rest: {
			find: 			'get /api/{model}',
			findOne: 		'get /api/{model}/:id',
			create: 		'post /api/{model}',
			update: 		'put /api/{model}/:id',
			destroy: 		'del /api/{model}/:id'
		}
		// When defined crud routes defined.
		// crud: {
		// 	find: 			'get /api/{model}/show',
		// 	findOne: 		'get /api/{model}/show/:id',
		// 	create: 		'post /api/{model}/create',
		// 	update: 		'put /api/{model}/update/:id',
		// 	destroy: 		'del /api/{model}/destroy/:id'
		// }
	}


};
