import { IService, IFacile, IErrors } from '../interfaces';
import { LoggerInstance } from 'winston';
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
