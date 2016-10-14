/**
 * PLACEHOLDER
 * This is a placeholder for
 * custom router.
 */

import { Router as ExpressRouter, IRouter } from 'express';
import { inherits } from 'util';

class Router {
	constructor() {
		return ExpressRouter.call(this, arguments);
	}
	other() {
	}
}
inherits(Router, ExpressRouter);

let rtr = new Router();


