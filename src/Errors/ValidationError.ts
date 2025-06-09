import {ResponseCode} from "../Responses/ResponseCode"

export class ValidationError extends Error {

    responseCode: ResponseCode
    error?: unknown

    constructor(message: string, responseCode: ResponseCode, error?: unknown) {
        super(message)
        this.responseCode = responseCode
        this.error = error
    }

    static CreateData(modelName: string, errors?: string[]): ValidationError {
        modelName = modelName ? modelName : ""
        const errorsText = errors ? errors?.join(" ") : ""
        return new ValidationError(
            `Сущность "${modelName}" не создана. Входные данные не валидны. ${errorsText}`,
            ResponseCode.ErrorBadRequest
        )
    }

    static UpdateData(modelName: string, errors?: string[]): ValidationError {
        modelName = modelName ? modelName : ""
        const errorsText = errors ? errors?.join(" ") : ""
        return new ValidationError(
            `Сущность "${modelName}" не обновлена. Входные данные не валидны. ${errorsText}`,
            ResponseCode.ErrorBadRequest
        )
    }

    static EntityNotFound(modelName?: string, errors?: string[]): ValidationError {
        modelName = modelName ? modelName : ""
        const errorsText = errors ? errors?.join(" ") : ""
        return new ValidationError(
            `Запрашиваемая запись сущности "${modelName}" не найдена. ${errorsText}`,
            ResponseCode.ErrorNotFound
        )
    }

    static NotFound(errors?: string[]): ValidationError {
        const errorsText = errors ? errors?.join(" ") : ""
        return new ValidationError(
            errorsText,
            ResponseCode.ErrorNotFound
        )
    }

}