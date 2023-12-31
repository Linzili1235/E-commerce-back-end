export enum HttpCode {
    E200 = 200,
    E201 = 201,
    E401 = 401, // Unauthorized
    E400 = 400, //INPUT ERROR
    E403 = 403, // FORBIDDEN
    E404 = 404, // NOT FOUND
    E409 = 409, // DUPLICATE
}

export enum ErrStr {
    OK ='success',
    LoggedIn = 'Logged in',
    LoggedOut = 'Logged out',
    ErrToken = 'Invalid Token',
    ErrUnauthorized = 'Unauthorized',
    // DATABASE
    ErrNoObj = 'Can not find the specific record',
    ErrStore = 'Failed to store dats',
    ErrInvalid = 'Invalid user id or product ids',
    ErrUserExist = 'this email already existed, please try another email',
    ErrInvoice = 'Fail to create invoice',
    ErrEmailOrPassword = 'Invalid email or password',
    // PARAMETER
    ErrMissingParameter = 'Missing Params',
}

export class Err {
    data: any;
    page: any;
    code: Number;
    msg: string;

    constructor(code: HttpCode = HttpCode.E200, msg: string = ErrStr.OK, data : any | null = null) {
        this.data = data;
        this.code = code;
        this.msg = msg;
    }

}
