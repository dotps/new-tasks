import {Response} from "express"
import {ResponseCode} from "./ResponseCode"
import {ValidationError} from "../Errors/ValidationError"
import {OrmError} from "../Errors/OrmError"
import {PrismaErrorHelper} from "../Helpers/PrismaErrorHelper"
import {Logger} from "../Services/Logger/Logger"

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

    static send(res: Response, error?: any): void {
        if (error instanceof ValidationError) {
            this.sendError(res, error.message, error.responseCode, error)
        }
        else if (error instanceof OrmError) {
            this.handlePrismaError(error)
            this.sendError(res, error.message, error.responseCode, error)
        }
        else if (error instanceof Error) {
            this.sendError(res, error.message, ResponseCode.ServerError, error)
        }
        else {
            this.sendError(res, "Неизвестная ошибка.", ResponseCode.ServerError, error)
        }
    }

    static sendError(res: Response, message: string, statusCode: ResponseCode, errorContext?: any): void {
        const error = new ResponseError(message, statusCode, errorContext)
        Logger.error(JSON.stringify(error))
        res.status(statusCode).json(error)
    }

    private static handlePrismaError(error: OrmError) {
        if (error.prismaError) {
            const prismaError = PrismaErrorHelper.getErrorMessage(error.prismaError.code);
            if (prismaError) {
                error.message += " " + prismaError.message
                error.responseCode = prismaError.responseCode
            }
        }
    }

    getMessage(): string {
        return this.message
    }
}