import {TaskData} from "../Data/Types"
import {IModel} from "./IModel"
import {ErrorMessages, ModelProps} from "./User"

export class Task implements IModel {

    private readonly id?: number
    private readonly projectId?: number
    private readonly title?: string
    private readonly description?: string
    private readonly dueAt?: Date

    private name: string = "Задача"
    private errorMessages: ErrorMessages = {
        idRequired: "Id обязателен.",
        titleRequired: "Заголовок обязателен.",
        taskNotChainToProject: "Задача не привязана к проекту.",
        dueWrong: "Указан некорректный срок выполнения.",
    }

    constructor(data: Partial<TaskData>) {
        this.id = Number(data?.id) || undefined
        this.projectId = Number(data?.projectId) || undefined
        this.title = data?.title?.toString().trim() || undefined
        this.description = data?.description?.toString().trim() || undefined
        this.dueAt = data?.dueAt ? new Date(data.dueAt) : undefined
    }

    getName(): string {
        return this.name
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
            id: this.id,
            projectId: this.projectId,
            title: this.title,
            description: this.description,
            dueAt: this.dueAt,
        }
    }

    isValidCreateData(errors: string[]): boolean {
        let isValid = true

        if (!this.title) {
            isValid = false
            errors.push(this.errorMessages?.titleRequired)
        }

        if (!this.projectId) {
            isValid = false
            errors.push(this.errorMessages?.taskNotChainToProject)
        }

        if (!this.isValidDue()) {
            isValid = false
            errors.push(this.errorMessages?.dueWrong)
        }

        return isValid
    }

    isValidUpdateData(errors: string[]): boolean {
        let isValid = true

        if (this.id === undefined) {
            isValid = false
            errors.push(this.errorMessages?.idRequired)
        }

        if (this.dueAt !== undefined && !this.isValidDue()) {
            isValid = false
            errors.push(this.errorMessages?.dueWrong)
        }

        return isValid
    }

    private isValidDue(): boolean {
        if (!this.dueAt || isNaN(this.dueAt.getTime())) return false
        return this.dueAt > new Date()
    }
}