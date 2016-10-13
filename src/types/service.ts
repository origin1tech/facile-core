
import { IService, IFacile } from '../interfaces';

/**
 * Base Service Class
 *
 * @export
 * @class Service
 */
export class Service implements IService {

	facile: IFacile;

	/**
	 * Creates an instance of Service.
	 *
	 * @param {IFacile} facile
	 *
	 * @memberOf Service
	 */
	constructor(facile: IFacile) {
		Object.defineProperty(this, 'facile', {
			enumerable: false,
			value: facile
		});
		return this;
	}

}