import {IModel} from "./Models/IModel"
import {Response} from "express"
import {ResponseCode} from "./ResponseCode"
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
        }
        catch (error) {
            throw new ApiError(
                `Серверная ошибка при создании сущности "${entityName}".`,
                ResponseCode.SERVER_ERROR,
                error
            )
        }
    }

    static async update<TModel extends IModel, TData>(res: Response, entity: TModel, updateMethod: Function): Promise<TData> {

        const validationErrors: string[] = []
        const entityName: string = entity.getModelName()

        if (!entity.isValidUpdateData(validationErrors)) {
            throw new ApiError(
                `Сущность "${entityName}" не обновлена. Входные данные не валидны. ${validationErrors.join(" ")}`,
                ResponseCode.ERROR_BAD_REQUEST
            )
        }

        try {
            return await updateMethod(entity.toUpdateData())
        }
        catch (error) {
            throw new ApiError(
                `Серверная ошибка при обновлении сущности "${entityName}".`,
                ResponseCode.SERVER_ERROR,
                error
            )
        }
    }
}