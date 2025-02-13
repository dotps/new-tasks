import {TaskData} from "../Data/Types"
import {IModel} from "./IModel"
import {ModelProps} from "./User"
import {DateHelper} from "../Utils/DateHelper"

export class Task implements IModel {

    id?: number
    projectId?: number
    title?: string
    description?: string
    dueAt?: Date
    createdAt?: Date

    constructor(data: Partial<TaskData>) {
        if (data?.id) this.id = Number(data.id)
        if (data?.projectId) this.projectId = Number(data.projectId)
        if (data?.title) this.title = data?.title?.toString().trim()
        if (data?.description) this.description = data?.description?.toString().trim()
        if (data?.dueAt) {
            this.dueAt = DateHelper.isValidStringDate(data.dueAt.toString()) ? new Date(data.dueAt) : new Date(NaN)
        }
        if (data?.createdAt) this.createdAt = new Date(data.createdAt)
    }

    get props(): ModelProps {
        return {
            name: "Задача",
            errorMessages: {
                idIsRequired: "Id обязателен.",
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

        // TODO: это под вопросом, т.к. при обновлении проекта может и не быть или задачу можно привязать к другому проекту
        // скорее всего валидацию нужно перенести в TaskService
        if (!this.projectId) {
            isValid = false
            errors.push(this.props.errorMessages?.taskNotChainToProject)
        }

        if (!this.isValidDue()) {
            isValid = false
            errors.push(this.props.errorMessages?.dueIsWrong)
        }

        return isValid
    }

    // isValidUpdateData<TaskData>(data: TaskData, errors: string[]): boolean {
    isValidUpdateData(errors: string[]): boolean {
        let isValid = true

        if (this.id === undefined) {
            isValid = false
            errors.push(this.props.errorMessages?.idIsRequired)
        }
        // TODO: доделать валидацию


        // if (data.projectId !== undefined && !data.projectId) {
        //     isValid = false
        //     errors.push(this.props.errorMessages?.taskNotChainToProject)
        // }
        //
        // if (data.dueAt !== undefined) {
        //     const dueDate = new Date(data.dueAt)
        //     if (isNaN(dueDate.getTime())) {
        //         isValid = false
        //         errors.push(this.props.errorMessages?.dueIsWrong)
        //     } else if (this.createdAt && dueDate < this.createdAt) {
        //         isValid = false
        //         errors.push(this.props.errorMessages?.dueIsWrong)
        //     }
        // }

        return isValid
    }

    private isValidDue(): boolean {
        if (!this.dueAt || isNaN(this.dueAt.getTime())) return false
        if (this.dueAt < new Date()) return false
        if (this.createdAt && this.dueAt <= this.createdAt) return false
        return true
    }
}