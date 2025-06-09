import {ProjectData} from "../types"
import {IModel} from "./model.interface"

export class Project implements IModel {

    private readonly id?: number
    private readonly userId?: number
    private readonly title?: string
    private readonly description?: string

    private modelName: string = "Проект"

    constructor(data: Partial<ProjectData>) {
        this.id = Number(data?.id) || undefined
        this.userId = Number(data?.userId) || undefined
        this.title = data?.title?.toString().trim() || undefined
        this.description = data?.description?.toString().trim() || undefined
    }

    getModelName(): string {
        return this.modelName
    }

    toCreateData(): Partial<ProjectData> {
        return {
            title: this.title,
            description: this.description,
            userId: this.userId,
        }
    }

    toUpdateData(): Partial<ProjectData> {
        return {
            ...this.toCreateData(),
            id: this.id,
        }
    }
}