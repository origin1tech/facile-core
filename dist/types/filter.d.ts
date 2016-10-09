import { IFilter, IFacile } from '../interfaces';
/**
 * Base Filter Class
 *
 * @export
 * @class Filter
 * @implements {IFilter}
 */
export declare class Filter implements IFilter {
    facile: IFacile;
    /**
     * Creates an instance of Filter.
     *
     * @param {IFacile} facile
     *
     * @memberOf Filter
     */
    constructor(facile: IFacile);
}
