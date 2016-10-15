import { IModel, IFacile } from '../interfaces';
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
	 * @method {LoggerInstance} log
	 * @memberOf Service
	 */
	get log(): LoggerInstance {
		return this.facile.log;
	}

}