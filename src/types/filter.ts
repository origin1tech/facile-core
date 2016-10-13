
import { IFilter, IFacile } from '../interfaces';

/**
 * Base Filter Class
 *
 * @export
 * @class Filter
 * @implements {IFilter}
 */
export class Filter implements IFilter {

	static type = 'Filter';

	protected facile: IFacile;

	/**
	 * Creates an instance of Filter.
	 *
	 * @param {IFacile} facile
	 * @contructor
	 * @memberOf Filter
	 */
	constructor(facile: IFacile) {
		Object.defineProperty(this, 'facile', {
			enumerable: false,
			value: facile
		});
		return this;
	}

}