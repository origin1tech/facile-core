import { IService, IFacile } from '../interfaces';
/**
 * Base Service Class
 *
 * @export
 * @class Service
 */
export declare class Service implements IService {
    static type: string;
    protected facile: IFacile;
    /**
     * Creates an instance of Service.
     *
     * @param {IFacile} facile
     * @constructor
     * @memberOf Service
     */
    constructor(facile: IFacile);
}
