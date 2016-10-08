import { IController, IModel, IService, IFacile } from '../interfaces';
/**
 * Base Controller Class
 *
 * @export
 * @class Controller
 */
export declare class Controller implements IController {
    private api;
    /**
     * Creates an instance of Controller.
     *
     * @param {IFacile} api
     *
     * @memberOf Controller
     */
    constructor(api: IFacile);
}
/**
 * Base Model Class
 *
 * @export
 * @class Model
 */
export declare class Model implements IModel {
    private api;
    /**
     * Creates an instance of Model.
     *
     * @param {IFacile} api
     *
     * @memberOf Model
     */
    constructor(api: IFacile);
}
/**
 * Base Service Class
 *
 * @export
 * @class Service
 */
export declare class Service implements IService {
    private api;
    /**
     * Creates an instance of Service.
     *
     * @param {IFacile} api
     *
     * @memberOf Service
     */
    constructor(api: IFacile);
}
