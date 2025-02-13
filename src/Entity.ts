import {IModel} from "./Models/IModel"
import {Response} from "express"
import {ResponseError} from "./ResponseError"
import {ResponseCode} from "./ResponseCode"
import {ResponseSuccess} from "./ResponseSuccess"

interface EntityWithId {
    id: number
}

export class Entity {

    static async create<TModel extends IModel, TData extends EntityWithId>(res: Response, entity: TModel, createMethod: Function): Promise<void> {
        const validationErrors: string[] = []
        const entityName: string = entity.props.name

        if (!entity.isValidCreateData(validationErrors)) {
            return ResponseError.send(res, `Сущность "${entityName}" не создана. Входные данные не валидны. ${validationErrors.join(" ")}`, ResponseCode.ERROR_BAD_REQUEST)
        }

        try {
            const createdEntity: TData = await createMethod(entity.toCreateData())
            if (!createdEntity?.id) {
                return ResponseError.send(res, `Сущность "${entityName}" не создана.`, ResponseCode.SERVER_ERROR)
            }
            ResponseSuccess.send(res, createdEntity, ResponseCode.SUCCESS_CREATED)
        } catch (errorContext) {
            console.log(errorContext)
            return ResponseError.send(res, `Серверная ошибка при создании сущности "${entityName}".`, ResponseCode.SERVER_ERROR, errorContext)
        }
    }

    static async update<TModel extends IModel, TData extends EntityWithId>(res: Response, entity: TModel, updateMethod: Function): Promise<void> {
        const validationErrors: string[] = []
        const entityName: string = entity.props.name

        if (!entity.isValidUpdateData(validationErrors)) {
            return ResponseError.send(res, `Сущность "${entityName}" не обновлена. Входные данные не валидны. ${validationErrors.join(" ")}`, ResponseCode.ERROR_BAD_REQUEST)
        }

        try {
            console.log("toUpdateData", entity.toUpdateData())
            const updatedEntity: TData = await updateMethod(entity.toUpdateData())
            ResponseSuccess.send(res, updatedEntity, ResponseCode.SUCCESS)
        } catch (errorContext) {
            console.log(errorContext)
            return ResponseError.send(res, `Серверная ошибка при обновлении сущности "${entityName}".`, ResponseCode.SERVER_ERROR, errorContext)
        }
    }
}