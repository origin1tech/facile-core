import { IFilter, IFacile } from '../interfaces';
/**
 * Base Filter Class
 *
 * @export
 * @class Filter
 * @implements {IFilter}
 */
export declare class Filter implements IFilter {
    static _type: string;
    private _facile;
    /**
     * Creates an instance of Filter.
     *
     * @param {IFacile} facile
     * @contructor
     * @memberOf Filter
     */
    constructor(facile: IFacile);
}
