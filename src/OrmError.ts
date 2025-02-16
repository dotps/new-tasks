import {ResponseCode} from "./ResponseCode"

export class OrmError extends Error {

    responseCode: ResponseCode
    error?: unknown

    constructor(error?: unknown, message: string = "Ошибка в ORM.", responseCode: ResponseCode = ResponseCode.SERVER_ERROR) {
        super(message)
        this.responseCode = responseCode
        this.error = error
    }
}