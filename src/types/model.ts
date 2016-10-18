import { IModel, IFacile, IErrors } from '../interfaces';
import { LoggerInstance } from 'winston';

/**
 * Base Model Class
 *
 * @export
 * @class Model
 */
export class Model implements IModel {

	static type = 'Model';
	protected facile: IFacile;

	/**
	 * Creates an instance of Model.
	 *
	 * @param {IFacile} facile
	 * @constructor
	 * @memberOf Model
	 */
	constructor(facile: IFacile) {
		Object.defineProperty(this, 'facile', {
			enumerable: false,
			value: facile
		});
		return this;
	}

	/**
	 * log
	 *
	 * @desc exposes Facile.log to class.
	 * @readonly
	 * @member {LoggerInstance} log
	 * @memberOf Service
	 */
	get log(): LoggerInstance {
		return this.facile.log;
	}

	/**
	 * errros
	 *
	 * @desc exposes Facile.errors to class.
	 * @readonly
	 * @member {IErrors}
	 * @memberOf Controller
	 */
	get errors(): IErrors {
		return this.facile._errors;
	}

	/**
	 * init
	 *
	 * @desc initializes the model.
	 * @method init
	 * @memberOf Model
	 */
	init() {
		throw new Error('Not Implmented: Model init method must be overridden.');
	}

}