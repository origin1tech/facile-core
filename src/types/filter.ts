
import { IFilter, IFacile } from '../interfaces';

/**
 * Base Filter Class
 *
 * @export
 * @class Filter
 * @implements {IFilter}
 */
export class Filter implements IFilter {

	/**
	 * Creates an instance of Filter.
	 *
	 * @param {IFacile} facile
	 *
	 * @memberOf Filter
	 */
	constructor(public facile: IFacile) {
		return this;
	}

}