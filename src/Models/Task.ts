import {TaskData} from "../Data/Types"
import {IModel} from "./IModel"
import {ModelProps} from "./User"

export class Task implements IModel {

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
        this.dueAt = data?.dueAt ? new Date(data.dueAt) : new Date()
        this.createdAt = data?.createdAt ? new Date(data.createdAt) : new Date()
    }

    get props(): ModelProps {
        return {
            name: "Задача",
            errorMessages: {
                titleIsRequired: "Заголовок обязателен.",
                taskNotChainToProject: "Задача не привязана к проекту.",
                dueIsWrong: "Указан некорректный срок выполнения.",
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
            errors.push(this.props.errorMessages?.titleIsRequired)
        }

        if (!this.projectId) {
            isValid = false
            errors.push(this.props.errorMessages?.taskNotChainToProject)
        }

        if (!this.dueAt || this.dueAt <= this.createdAt) {
            isValid = false
            errors.push(this.props.errorMessages?.dueIsWrong)
        }

        return isValid
    }
}