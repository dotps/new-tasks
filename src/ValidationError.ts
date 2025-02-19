import {ResponseCode} from "./ResponseCode"

export class ValidationError extends Error {

    responseCode: ResponseCode
    error?: unknown

    constructor(message: string, responseCode: ResponseCode, error?: unknown) {
        super(message)
        this.responseCode = responseCode
        this.error = error
    }

    static CreateData(modelName: string, errors?: string[]): ValidationError {
        return new ValidationError(
            `Сущность "${modelName}" не создана. Входные данные не валидны. ${errors?.join(" ")}`,
            ResponseCode.ERROR_BAD_REQUEST
        )
    }

    static UpdateData(modelName: string, errors?: string[]): ValidationError {
        return new ValidationError(
            `Сущность "${modelName}" не обновлена. Входные данные не валидны. ${errors?.join(" ")}`,
            ResponseCode.ERROR_BAD_REQUEST
        )
    }

    static EntityNotFound(modelName: string, errors?: string[]): ValidationError {
        return new ValidationError(
            `Запрашиваемая запись сущности "${modelName}" не найдена. ${errors?.join(" ")}`,
            ResponseCode.ERROR_NOT_FOUND
        )
    }

}