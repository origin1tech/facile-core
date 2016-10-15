import { IModel, IFacile } from '../interfaces';
import { LoggerInstance } from 'winston';
/**
 * Base Model Class
 *
 * @export
 * @class Model
 */
export declare class Model implements IModel {
    static type: string;
    protected facile: IFacile;
    /**
     * Creates an instance of Model.
     *
     * @param {IFacile} facile
     * @constructor
     * @memberOf Model
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
