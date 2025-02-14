import {IModel} from "../Models/IModel"
import {IEntityCommand} from "./IEntityCommand"
import {ValidationError} from "../ValidationError"
import {ResponseCode} from "../ResponseCode"

export class CreateEntityCommand<TModel extends IModel, TData> implements IEntityCommand<TModel, TData> {

    private readonly method: Function
    private readonly entity: TModel

    constructor(entity: TModel, method: Function) {
        this.entity = entity
        this.method = method
    }

    async execute(): Promise<TData> {

        const validationErrors: string[] = []
        const entityName: string = this.entity.getModelName()

        if (!this.entity.isValidCreateData(validationErrors)) {
            throw new ValidationError(
                `Сущность "${entityName}" не создана. Входные данные не валидны. ${validationErrors.join(" ")}`,
                ResponseCode.ERROR_BAD_REQUEST
            )
        }

        // TODO: можно ли отказаться от toCreateData() toUpdateData()

        return this.method(this.entity.toCreateData())
    }
}