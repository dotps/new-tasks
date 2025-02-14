import {IModel} from "../Models/IModel"
import {IEntityCommand} from "./IEntityCommand"
import {ValidationError} from "../ValidationError"
import {ResponseCode} from "../ResponseCode"

export class UpdateEntityCommand<TModel extends IModel, TData> implements IEntityCommand<TModel, TData> {

    private readonly method: Function
    private readonly entity: TModel

    constructor(entity: TModel, method: Function) {
        this.entity = entity
        this.method = method
    }

    async execute(): Promise<TData> {

        const validationErrors: string[] = []
        const entityName: string = this.entity.getModelName()

        if (!this.entity.isValidUpdateData(validationErrors)) {
            throw new ValidationError(
                `Сущность "${entityName}" не обновлена. Входные данные не валидны. ${validationErrors.join(" ")}`,
                ResponseCode.ERROR_BAD_REQUEST
            )
        }

        return this.method(this.entity.toUpdateData())
    }
}