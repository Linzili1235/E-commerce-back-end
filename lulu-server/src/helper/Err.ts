export enum HttpCode {
    E200 = 200,
    E201 = 201,
    E400 = 400, //INPUT ERROR
    E404 = 404, // NOT FOUND
}

export enum ErrStr {
    OK ='success',

    // DATABASE
    ErrNoObj = 'Can not find the specific record',
    ErrStore = 'Failed to store dats',
    ErrInvalid = 'Invalid user id or product ids',
    // PARAMETER
    ErrMissingParameter = 'Missing Params'
}

export class Err {
    data: any;
    page: any;
    code: Number;
    msg: string;

    constructor(code: HttpCode = HttpCode.E200, msg: string = ErrStr.OK, data = null) {
        this.data = data;
        this.code = code;
        this.msg = msg;
    }

}
