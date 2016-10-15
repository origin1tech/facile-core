
import { IController, IFacile } from '../interfaces';
import { LoggerInstance } from 'winston';

/**
 * Base Controller Class
 *
 * @export
 * @class Controller
 */
export class Controller implements IController {

	static type = 'Controller';
	protected facile: IFacile;

	/**
	 * Creates an instance of Controller.
	 *
	 * @param {IFacile} facile
	 * @constructor
	 * @memberOf Controller
	 */
	constructor(facile: IFacile) {
		Object.defineProperty(this, 'facile', {
			enumerable: false,
			value: facile
		});

	}

	/**
	 * log
	 *
	 * @desc exposes Facile.log to class.
	 * @readonly
	 * @method {LoggerInstance} log
	 * @memberOf Service
	 */
	get log(): LoggerInstance {
		return this.facile.log;
	}

}

