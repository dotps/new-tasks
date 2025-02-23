import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library"
import {ResponseCode} from "../Responses/ResponseCode"

export class OrmError extends Error {

    responseCode: ResponseCode
    error?: unknown
    prismaError?: PrismaClientKnownRequestError

    constructor(error?: unknown, message: string = "Ошибка в ORM.", responseCode: ResponseCode = ResponseCode.SERVER_ERROR) {
        super(message)
        this.responseCode = responseCode
        if (error instanceof PrismaClientKnownRequestError) this.prismaError = error
        else this.error = error
    }
}