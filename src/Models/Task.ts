import {TaskData, TaskStatus, toTaskStatus} from "../Data/Types"
import {IModel} from "./IModel"

export class Task implements IModel {

    private readonly id?: number
    private readonly projectId?: number
    private readonly title?: string
    private readonly description?: string
    private readonly dueAt?: Date
    private readonly status?: TaskStatus
    // private readonly completedAt?: Date

    private modelName: string = "Задача"

    constructor(data: Partial<TaskData> | null) {
        this.id = Number(data?.id) || undefined
        this.projectId = Number(data?.projectId) || undefined
        this.title = data?.title?.toString().trim() || undefined
        this.description = data?.description?.toString().trim() || undefined
        this.dueAt = data?.dueAt ? new Date(data.dueAt) : undefined
        this.status = toTaskStatus(data?.status?.toString().trim())
        // this.completedAt = data?.completedAt ? new Date(data.completedAt) : undefined
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
            status: this.status,
            // completedAt: this.completedAt,
        }
    }
}