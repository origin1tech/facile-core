import { IFilter, IFacile } from '../interfaces';
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
     * @method {LoggerInstance} log
     * @memberOf Service
     */
    readonly log: LoggerInstance;
}
