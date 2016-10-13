
import { IController, IFacile } from '../interfaces';

/**
 * Base Controller Class
 *
 * @export
 * @class Controller
 */
export class Controller implements IController {

	static _type = 'Controller';

	private _facile: IFacile;

	/**
	 * Creates an instance of Controller.
	 *
	 * @param {IFacile} facile
	 * @constructor
	 * @memberOf Controller
	 */
	constructor(facile: IFacile) {
		Object.defineProperty(this, '_facile', {
			enumerable: false,
			value: facile
		});
		return this;
	}

}

