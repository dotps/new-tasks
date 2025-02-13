import {TaskData} from "../Data/Types"
import {IModel} from "./IModel"
import {ModelProps} from "./User"
import {DateHelper} from "../Utils/DateHelper"

export class Task implements IModel {

    id?: number
    projectId?: number
    title?: string
    description?: string
    dueAt?: Date | null
    createdAt?: Date

    constructor(data: Partial<TaskData>) {

        const { id, projectId, title, description, dueAt, createdAt } = data

        this.id = (id !== undefined) ? Number(id) : undefined
        this.projectId = (projectId !== undefined) ? Number(projectId) : undefined
        this.title = (title !== undefined) ? title.toString().trim() : undefined
        this.description = (description !== undefined) ? description?.toString().trim() : undefined
        this.dueAt = (dueAt !== undefined && DateHelper.isValidDate(dueAt)) ? new Date(dueAt) : undefined
        this.createdAt = createdAt ? new Date(createdAt) : undefined
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
        return Object.assign({}, this) as TaskData
    }

    isValidData(errors: string[]): boolean {
        let isValid = true

        if (!this.title) {
            isValid = false
            errors.push(this.props.errorMessages?.titleRequired)
        }

        // TODO: скорее всего валидацию нужно перенести в TaskService
        if (this.projectId !== undefined && !this.projectId) {
            isValid = false
            errors.push(this.props.errorMessages?.taskNotChainToProject)
        }

        if (this.dueAt !== undefined && !this.isValidDue()) {
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

        if (this.projectId !== undefined && !this.projectId) {
            isValid = false
            errors.push(this.props.errorMessages?.taskNotChainToProject)
        }

        // if (this.dueAt !== undefined && !this.isValidDue()) {
        //     isValid = false
        //     errors.push(this.props.errorMessages?.dueWrong)
        // }

        return isValid
    }

    private isValidDue(): boolean {
        if (!this.dueAt || isNaN(this.dueAt.getTime())) return false
        if (this.dueAt < new Date()) return false
        if (this.createdAt !== undefined && this.dueAt <= this.createdAt) return false
        return true
    }
}