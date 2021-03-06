
import { IController, IFacile, IErrors, IService, IModel } from '../interfaces';
import { LoggerInstance } from 'winston';
import { Collection } from '../core/collection';

/**
 * Base Controller Class
 *
 * @export
 * @class Controller
 */
export class Controller implements IController {

	static type = 'Controller';

	/**
	 * Creates an instance of Controller.
	 *
	 * @param {IFacile} facile
	 * @constructor
	 * @memberOf Controller
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

