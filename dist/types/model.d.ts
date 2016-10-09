import { IModel, IFacile } from '../interfaces';
/**
 * Base Model Class
 *
 * @export
 * @class Model
 */
export declare class Model implements IModel {
    facile: IFacile;
    /**
     * Creates an instance of Model.
     *
     * @param {IFacile} facile
     *
     * @memberOf Model
     */
    constructor(facile: IFacile);
}
