
import { IService, IFacile } from '../interfaces';

/**
 * Base Service Class
 *
 * @export
 * @class Service
 */
export class Service implements IService {

	static _type = 'Service';

	private _facile: IFacile;

	/**
	 * Creates an instance of Service.
	 *
	 * @param {IFacile} facile
	 * @constructor
	 * @memberOf Service
	 */
	constructor(facile: IFacile) {
		Object.defineProperty(this, '_facile', {
			enumerable: false,
			value: facile
		});
		return this;
	}

}