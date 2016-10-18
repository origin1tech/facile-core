
import { IService, IFacile, IErrors } from '../interfaces';
import { LoggerInstance } from 'winston';

/**
 * Base Service Class
 *
 * @export
 * @class Service
 */
export class Service implements IService {

	static type = 'Service';
	protected facile: IFacile;

	/**
	 * Creates an instance of Service.
	 *
	 * @param {IFacile} facile
	 * @constructor
	 * @memberOf Service
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

}