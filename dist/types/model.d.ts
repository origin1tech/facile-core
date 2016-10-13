import { IModel, IFacile } from '../interfaces';
/**
 * Base Model Class
 *
 * @export
 * @class Model
 */
export declare class Model implements IModel {
    static _type: string;
    private _facile;
    /**
     * Creates an instance of Model.
     *
     * @param {IFacile} facile
     * @constructor
     * @memberOf Model
     */
    constructor(facile: IFacile);
}
