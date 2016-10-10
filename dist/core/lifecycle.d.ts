/// <reference types="node" />
import { ILifecycle } from '../interfaces';
import { EventEmitter } from 'events';
export declare class Lifecycle extends EventEmitter implements ILifecycle {
    _events: string[];
    _before: any;
    _after: any;
    constructor();
    before(name: string, event: Function): void;
    after(name: string, event: Function): void;
}
