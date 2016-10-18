import { IController, IFacile, IErrors } from '../interfaces';
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
     * @member {LoggerInstance} log
     * @memberOf Service
     */
    readonly log: LoggerInstance;
    /**
     * errros
     *
     * @desc exposes Facile.errors to class.
     * @readonly
     * @member {IErrors}
     * @memberOf Controller
     */
    readonly errors: IErrors;
}
