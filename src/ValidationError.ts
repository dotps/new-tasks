import {ResponseCode} from "./ResponseCode"

export class ValidationError extends Error {

    responseCode: ResponseCode
    error?: unknown

    constructor(message: string, responseCode: ResponseCode, error?: unknown) {
        super(message)
        this.responseCode = responseCode
        this.error = error
    }
}