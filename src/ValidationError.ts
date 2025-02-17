import {ResponseCode} from "./ResponseCode"

export class ValidationError extends Error {

    responseCode: ResponseCode
    error?: unknown

    constructor(message: string, responseCode: ResponseCode, error?: unknown) {
        super(message)
        this.responseCode = responseCode
        this.error = error
    }

    static throwCreateData(modelName: string, errors: string[]): ValidationError {
        throw new ValidationError(
            `Сущность "${modelName}" не создана. Входные данные не валидны. ${errors.join(" ")}`,
            ResponseCode.ERROR_BAD_REQUEST
        )
    }

    static throwUpdateData(modelName: string, errors: string[]): ValidationError {
        throw new ValidationError(
            `Сущность "${modelName}" не обновлена. Входные данные не валидны. ${errors.join(" ")}`,
            ResponseCode.ERROR_BAD_REQUEST
        )
    }
}