import { IController, IFacile } from '../interfaces';
import { LoggerInstance } from 'winston';
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
    /**
     * log
     *
     * @desc exposes Facile.log to class.
     * @readonly
     * @method {LoggerInstance} log
     * @memberOf Service
     */
    readonly log: LoggerInstance;
}
