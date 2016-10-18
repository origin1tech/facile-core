
import { IFilter, IFacile, IErrors } from '../interfaces';
import { LoggerInstance } from 'winston';

/**
 * Base Filter Class
 *
 * @export
 * @class Filter
 * @implements {IFilter}
 */
export class Filter implements IFilter {

	static type = 'Filter';
	protected facile: IFacile;

	/**
	 * Creates an instance of Filter.
	 *
	 * @param {IFacile} facile
	 * @contructor
	 * @memberOf Filter
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