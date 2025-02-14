import {Response} from "express"
import {ResponseCode} from "./ResponseCode"

import {ApiError} from "./ApiError"

export class ResponseError {
    private readonly message: string
    private readonly statusCode: number
    private readonly error: any
    private readonly timestamp: string

    constructor(message: string, statusCode: number, error?: any) {
        this.message = message
        this.statusCode = statusCode
        this.error = error
        this.timestamp = new Date().toISOString()
    }

    private static sendError(res: Response, message: string, statusCode: ResponseCode, errorContext?: any): void {
        const error = new ResponseError(message, statusCode, errorContext)
        res.status(statusCode).json(error)
    }

    static send(res: Response, errorContext: any): void {

        if (errorContext instanceof ApiError) {
            this.sendError(res, errorContext.message, errorContext.responseCode, errorContext)
        }
        else if (errorContext instanceof Error) {
            this.sendError(res, errorContext.message, ResponseCode.SERVER_ERROR, errorContext)
        }
        else {
            this.sendError(res, "Неизвестная ошибка.", ResponseCode.SERVER_ERROR, errorContext)
        }

        console.log(errorContext)
    }
}