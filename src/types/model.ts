import { IModel, IFacile } from '../interfaces';

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
	 * @param {IFacile} facile
	 *
	 * @memberOf Model
	 */
	constructor(public facile: IFacile) {
		return this;
	}

}