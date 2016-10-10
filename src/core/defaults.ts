
import * as cons from 'consolidate';
import { join } from 'path';
import { IConfig } from '../interfaces';

export const packages = {
	pkg: require('../../package.json'),
	appPkg: require(join(process.cwd(), 'package.json'))
};

export const config: IConfig = {

	cwd: process.cwd(),
	pkg: packages.appPkg,
	env: 'development',
	logLevel: 'info',
	host: '127.0.0.1',
	port: 8080,
	maxConnections: 128,
	views: {
		layout: 'index',
		engine: {
			name: 'ejs',
			renderer: cons.ejs
		},
		'view engine': 'ejs',
		views: '/'
	},
	auto: false

};