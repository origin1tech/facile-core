import { IFilter, IFacile, IErrors } from '../interfaces';
import { LoggerInstance } from 'winston';
/**
 * Base Filter Class
 *
 * @export
 * @class Filter
 * @implements {IFilter}
 */
export declare class Filter implements IFilter {
    static type: string;
    protected facile: IFacile;
    /**
     * Creates an instance of Filter.
     *
     * @param {IFacile} facile
     * @contructor
     * @memberOf Filter
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
