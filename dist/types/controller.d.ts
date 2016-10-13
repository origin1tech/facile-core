import { IController, IFacile } from '../interfaces';
/**
 * Base Controller Class
 *
 * @export
 * @class Controller
 */
export declare class Controller implements IController {
    static type: string;
    protected facile: IFacile;
    /**
     * Creates an instance of Controller.
     *
     * @param {IFacile} facile
     * @constructor
     * @memberOf Controller
     */
    constructor(facile: IFacile);
}
