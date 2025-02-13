import {TaskData} from "../Data/Types"
import {IModel} from "./IModel"
import {ModelProps} from "./User"
import {DateHelper} from "../Utils/DateHelper"

export class Task implements IModel {

    private id?: number
    private projectId?: number
    private title?: string
    private description?: string
    private dueAt?: Date

    constructor(data: Partial<TaskData>) {

        this.id = Number(data?.id) || undefined
        this.projectId = Number(data?.projectId) || undefined
        this.title = data?.title?.toString().trim() || undefined
        this.description = data?.description?.toString().trim() || undefined
        this.dueAt = data?.dueAt ? new Date(data.dueAt) : undefined

    }

    get props(): ModelProps {
        return {
            name: "Задача",
            errorMessages: {
                idRequired: "Id обязателен.",
                titleRequired: "Заголовок обязателен.",
                taskNotChainToProject: "Задача не привязана к проекту.",
                dueWrong: "Указан некорректный срок выполнения.",
            },
        }
    }

    toData(): TaskData {
        // return Object.assign({}, this) as TaskData
        return {} as TaskData
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
            errors.push(this.props.errorMessages?.titleRequired)
        }

        if (!this.projectId) {
            isValid = false
            errors.push(this.props.errorMessages?.taskNotChainToProject)
        }

        if (!this.isValidDue()) {
            isValid = false
            errors.push(this.props.errorMessages?.dueWrong)
        }

        return isValid
    }

    isValidUpdateData(errors: string[]): boolean {
        let isValid = true

        if (this.id === undefined) {
            isValid = false
            errors.push(this.props.errorMessages?.idRequired)
        }

        if (this.dueAt !== undefined && !this.isValidDue()) {
            isValid = false
            errors.push(this.props.errorMessages?.dueWrong)
        }

        return isValid
    }

    private isValidDue(): boolean {
        if (!this.dueAt || isNaN(this.dueAt.getTime())) return false
        return this.dueAt > new Date()
    }
}