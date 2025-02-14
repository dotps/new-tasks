import {IModel} from "./Models/IModel"
import {Response} from "express"
import {ResponseError} from "./ResponseError"
import {ResponseCode} from "./ResponseCode"
import {ResponseSuccess} from "./ResponseSuccess"
import {ApiError} from "./ApiError"

export class Entity {

    static async create<TModel extends IModel, TData>(res: Response, entity: TModel, createMethod: Function): Promise<TData> {
        const validationErrors: string[] = []
        const entityName: string = entity.getModelName()

        if (!entity.isValidCreateData(validationErrors)) {
            throw new ApiError(
                `Сущность "${entityName}" не создана. Входные данные не валидны. ${validationErrors.join(" ")}`,
                ResponseCode.ERROR_BAD_REQUEST
            )
        }

        try {
            return await createMethod(entity.toCreateData())
        } catch (error) {
            throw new ApiError(
                `Серверная ошибка при создании сущности "${entityName}".`,
                ResponseCode.SERVER_ERROR,
                error
            )
        }
    }

    static async update<TModel extends IModel, TData>(res: Response, entity: TModel, updateMethod: Function): Promise<void> {
        const validationErrors: string[] = []
        const entityName: string = entity.getModelName()

        if (!entity.isValidUpdateData(validationErrors)) {
            return ResponseError.send(res, `Сущность "${entityName}" не обновлена. Входные данные не валидны. ${validationErrors.join(" ")}`, ResponseCode.ERROR_BAD_REQUEST)
        }

        try {
            const updatedEntity: TData = await updateMethod(entity.toUpdateData())
            ResponseSuccess.send(res, updatedEntity, ResponseCode.SUCCESS)
        } catch (errorContext) {
            return ResponseError.send(res, `Серверная ошибка при обновлении сущности "${entityName}".`, ResponseCode.SERVER_ERROR, errorContext)
        }
    }
}