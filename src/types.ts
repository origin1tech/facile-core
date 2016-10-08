
import { IController, IModel, IService, IFacile } from './interfaces';

/**
 * Base Controller Class
 *
 * @export
 * @class Controller
 */
export class Controller implements IController {

	/**
	 * Creates an instance of Controller.
	 *
	 * @param {IFacile} api
	 *
	 * @memberOf Controller
	 */
	constructor(private api: IFacile) {
		return this;
	}

}


/**
 * Base Model Class
 *
 * @export
 * @class Model
 */
export class Model implements IModel {

	/**
	 * Creates an instance of Model.
	 *
	 * @param {IFacile} api
	 *
	 * @memberOf Model
	 */
	constructor(private api: IFacile) {
		return this;
	}

}

/**
 * Base Service Class
 *
 * @export
 * @class Service
 */
export class Service implements IService {

	/**
	 * Creates an instance of Service.
	 *
	 * @param {IFacile} api
	 *
	 * @memberOf Service
	 */
	constructor(private api: IFacile) {
		return this;
	}

}