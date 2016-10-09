
import { IService, IFacile } from '../interfaces';

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
	 * @param {IFacile} facile
	 *
	 * @memberOf Service
	 */
	constructor(public facile: IFacile) {
		return this;
	}

}