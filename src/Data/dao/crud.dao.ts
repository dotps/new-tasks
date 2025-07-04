import {EntityData} from "../types"
import {OrmError} from "../../errors/orm-error"
import {CrudMethods} from "./crud-methods"
import {ICrudDAO} from "./crud.dao.interface"


export class CrudDAO<TData extends EntityData, TModel extends CrudMethods<TData>> implements ICrudDAO<TData> {
    protected readonly model: TModel

    constructor(model: TModel) {
        this.model = model
    }

    async create(data: Partial<TData>): Promise<TData> {
        try {
            return await this.model.create({
                data: data as TData
            })
        } catch (error) {
            throw new OrmError(error)
        }
    }

    async update(data: Partial<TData>): Promise<TData> {

        if (!data.id) throw new OrmError("Id обязателен для обновления сущностей.")

        try {
            return await this.model.update({
                where: {
                    id: data.id
                },
                data: data as TData
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }

    async delete(id: number): Promise<TData> {
        try {
            return await this.model.delete({
                where: {
                    id: id
                },
            })
        } catch (error) {
            throw new OrmError(error)
        }
    }

    async getById(id: number): Promise<TData | null> {
        try {
            return await this.model.findUnique({
                where: {
                    id: id
                }
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }
}
