import { IModel, IFacile, IErrors, IService } from '../interfaces';
import { LoggerInstance } from 'winston';
import { Collection } from '../core/collection';

/**
 * Base Model Class
 *
 * @export
 * @class Model
 */
export class Model implements IModel {

	static type = 'Model';

	/**
	 * Creates an instance of Model.
	 *
	 * @param {IFacile} facile
	 * @constructor
	 * @memberOf Model
	 */
	constructor(protected facile: IFacile) {}

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

	/**
	 * service
	 *
	 * @method service
	 * @template T
	 * @param {string} name
	 * @returns {T}
	 *
	 * @memberOf Service
	 */
	service<T>(name: string): T {
		let collection: Collection<IService> = this.facile._services;
		return collection.get<T>(name);
	}

	/**
	 * model
	 *
	 * @method model
	 * @template T
	 * @param {string} name
	 * @returns {T}
	 *
	 * @memberOf Service
	 */
	model<T>(name: string): T {
		let collection: Collection<IModel> = this.facile._models;
		return collection.get<T>(name);
	}

}