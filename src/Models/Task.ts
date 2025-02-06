import {TaskData} from "../Data/Types"

export class Task {

    id?: number
    projectId?: number
    title: string
    description: string
    dueAt: Date
    createdAt: Date

    constructor(data: Partial<TaskData>) {
        if (data?.id) this.id = Number(data?.id)
        if (data?.projectId) this.projectId = Number(data?.projectId)
        this.title = data?.title?.toString().trim() || ""
        this.description = data?.description?.toString().trim() || ""
        this.dueAt = data?.dueAt || new Date()
        this.createdAt = data?.createdAt || new Date()
    }

    toData(): TaskData {
        return Object.assign({}, this) as TaskData
    }

    isValidData(errors: string[]): boolean {
        let isValid = true

        if (!this.title) {
            isValid = false
            errors.push("Заголовок обязателен.")
        }

        if (!this.projectId) {
            isValid = false
            errors.push("Задача не привязана к проекту.")
        }

        if (!this.dueAt || this.dueAt <= this.createdAt) {
            isValid = false
            errors.push("Указан некорректный срок выполнения.")
        }

        return isValid
    }
}