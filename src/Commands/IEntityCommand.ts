import {IModel} from "../Models/IModel"

export interface IEntityCommand<TModel extends IModel, TData> {
    execute(): Promise<TData>
}