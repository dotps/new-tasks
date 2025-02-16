import {EntityData} from "./Data/Types"

export interface IRepository {
    create(data: EntityData): Promise<EntityData>
    update(data: EntityData): Promise<EntityData>
}