
import { IService, IFacile, IErrors, IModel } from '../interfaces';
import { LoggerInstance } from 'winston';
import { Collection } from '../core/collection';

/**
 * Base Service Class
 *
 * @export
 * @class Service
 */
export class Service implements IService {

	static type = 'Service';

	/**
	 * Creates an instance of Service.
	 *
	 * @param {IFacile} facile
	 * @constructor
	 * @memberOf Service
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