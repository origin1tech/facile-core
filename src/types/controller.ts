
import { IController, IFacile } from '../interfaces';

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
	 * @param {IFacile} facile
	 *
	 * @memberOf Controller
	 */
	constructor(public facile: IFacile) {
		return this;
	}

}

