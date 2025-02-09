import {TaskData} from "../Data/Types"
import {IModel} from "./IModel"
import {ModelProps} from "./User"

export class Task implements IModel {

    id?: number
    projectId?: number
    title: string
    description: string
    dueAt?: Date
    createdAt?: Date

    constructor(data: Partial<TaskData>) {
        if (data?.id) this.id = Number(data.id)
        if (data?.projectId) this.projectId = Number(data.projectId)
        this.title = data?.title?.toString().trim() || ""
        this.description = data?.description?.toString().trim() || ""
        if (data?.dueAt) this.dueAt = data.dueAt
        if (data?.createdAt) this.createdAt = new Date(data.createdAt)
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

        // TODO: тут надо переделать, дата создания не известна, тут надо проверить на валидность соответствия даты
        if (!this.isValidDue()) {
            isValid = false
            errors.push(this.props.errorMessages?.dueIsWrong)
        }

        return isValid
    }

    private isValidDue(): boolean | undefined {
        return this.dueAt && this.createdAt && this.dueAt > this.createdAt
    }
    // private isNotValidDue(): boolean {
    //     return (this.createdAt && this.dueAt <= this.createdAt)
    // }
}