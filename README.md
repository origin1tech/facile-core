![alt tag](https://raw.githubusercontent.com/origin1tech/facile/master/img/logo.png)

A Bare Bones Express Framework.

## Why Facile

Facile pronounced "fasal" is a bare metal unopinionated Framework
that organizes your api but makes little to no opinions on how
to go about it.

## Typescript First

We love Typescript and consider it a must for the large robust applications
of today. This is particularly true when working with multiple developers
or on teams. It makes refactoring a breeze and speeds up development of
team members due by making the api clear and understandable.

## Facile Without Typescript

Can I use Facile without Typescript? Absolutely! Facile is provided as an
external module and can be used with or without Typescript. In fact it
is may be more efficient when prototyping to not use Typescript.

## Kits

For those that would like a litle better starting point to get your feet
wet, checkout one of the Facile kits!

## Basic Usage

```js

// Please see "kits" for more detailed examples.

import { facile, IConfig, IPolicies,
					IRoutes, Service, Filter,
					Controller } from './';
import * as expressSession from 'express-session';

let config: IConfig = {
	host: '127.0.0.1',
	port: 3000
}

let session = expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
});

let policy: IPolicies = {
	'*': true,
	DefaultController: {
		index: 'DefaultFilter.isAuthenticated'
	}
};

let routes: IRoutes = {
	'/': 'DefaultController.index'
};

class DefaultService extends Service {
	capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}

class DefaultFilter extends Filter {
	isAuthenticated(req, res, next) {
		next();
	}
}

class DefaultController extends Controller {
	index(req, res, next) {
		this.log.debug('Test controller works!');
		res.send('test');
	}
}

// NOTE: You can also register objects
// of like components. You can also specify
// custom names for any component.
//
// .registerComponent('MyController', SomeController)
// .registerComponent({
// 		MyController: SomeController
// })

facile
	.registerMiddleware('session', session)
	.registerPolicy(policy)
	.registerComponent(DefaultService)
	.registerComponent(DefaultFilter)
	.registerComponent(DefaultController)
	.registerRoute(routes)
	.start(config);

```