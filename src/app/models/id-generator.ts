export class IdGenerator {

    private _id: number;
    private _prefix: string;

    constructor(prefix: string, initValue: number = 0) {
        this._prefix = prefix;
        this._id = initValue;
    }

    public getNext(): string {
        return `${this._prefix}-${this._id++}`;
    }

}
