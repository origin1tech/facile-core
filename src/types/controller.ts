
import { IController, IFacile } from '../interfaces';

/**
 * Base Controller Class
 *
 * @export
 * @class Controller
 */
export class Controller implements IController {

	static type = 'Controller';

	protected facile: IFacile;

	/**
	 * Creates an instance of Controller.
	 *
	 * @param {IFacile} facile
	 * @constructor
	 * @memberOf Controller
	 */
	constructor(facile: IFacile) {
		Object.defineProperty(this, 'facile', {
			enumerable: false,
			value: facile
		});
		return this;
	}

}

