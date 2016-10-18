import { IModel, IFacile, IErrors } from '../interfaces';
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
    /**
     * init
     *
     * @desc initializes the model.
     * @method init
     * @memberOf Model
     */
    init(): void;
}
