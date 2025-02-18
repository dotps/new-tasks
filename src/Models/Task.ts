import {TaskData, TaskStatus, toTaskStatus} from "../Data/Types"
import {IModel} from "./IModel"

export class Task implements IModel {

    private readonly id?: number
    private readonly projectId?: number
    private readonly title?: string
    private readonly description?: string
    private readonly dueAt?: Date
    private readonly status?: TaskStatus

    private modelName: string = "Задача"

    constructor(data: Partial<TaskData>) {
        this.id = Number(data?.id) || undefined
        this.projectId = Number(data?.projectId) || undefined
        this.title = data?.title?.toString().trim() || undefined
        this.description = data?.description?.toString().trim() || undefined
        this.dueAt = data?.dueAt ? new Date(data.dueAt) : undefined
        this.status = toTaskStatus(data?.status?.toString().trim())
    }

    getModelName(): string {
        return this.modelName
    }

    toCreateData(): Partial<TaskData> {
        return {
            projectId: this.projectId,
            title: this.title,
            description: this.description,
            dueAt: this.dueAt,
        }
    }

    toUpdateData(): Partial<TaskData> {
        return {
            ...this.toCreateData(),
            id: this.id,
            status: this.status
        }
    }
}