import { IModel, IFacile } from '../interfaces';

/**
 * Base Model Class
 *
 * @export
 * @class Model
 */
export class Model implements IModel {

	static _type = 'Model';

	private _facile: IFacile;

	/**
	 * Creates an instance of Model.
	 *
	 * @param {IFacile} facile
	 * @constructor
	 * @memberOf Model
	 */
	constructor(facile: IFacile) {
		Object.defineProperty(this, '_facile', {
			enumerable: false,
			value: facile
		});
		return this;
	}

}