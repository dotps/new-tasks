import {Response} from "express"
import {ResponseCode} from "./ResponseCode"

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

    static send(res: Response, message: string, statusCode: ResponseCode, errorContext?: any): void {
        const error = new ResponseError(message, statusCode, errorContext)
        res.status(statusCode).json(error)
    }
}