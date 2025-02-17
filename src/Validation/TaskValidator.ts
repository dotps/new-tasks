import {TaskData} from "../Data/Types"
import {ErrorMessages} from "../Models/ErrorMessages"
import {ValidationError} from "../ValidationError"
import {Task} from "../Models/Task"
import {IEntityValidator} from "./IEntityValidator"

export class TaskValidator implements IEntityValidator {
    private model: Task
    private errorMessages: ErrorMessages = {
        idRequired: "Id обязателен.",
        titleRequired: "Заголовок обязателен.",
        taskNotChainToProject: "Задача не привязана к проекту.",
        dueWrong: "Указан некорректный срок выполнения.",
    }

    constructor(model: Task) {
        this.model = model
    }

    isValidCreateData(): boolean {
        const errors: string[] = []
        const data: Partial<TaskData> = this.model.toCreateData()
        let isValid = true

        if (!data.title) {
            isValid = false
            errors.push(this.errorMessages?.titleRequired)
        }

        if (!data.projectId) {
            isValid = false
            errors.push(this.errorMessages?.taskNotChainToProject)
        }

        if (!this.isValidDue(data.dueAt)) {
            isValid = false
            errors.push(this.errorMessages?.dueWrong)
        }

        if (!isValid) {
            ValidationError.throwCreateData(this.model.getModelName(), errors)
        }

        return isValid
    }

    isValidUpdateData(): boolean {
        const errors: string[] = []
        const data: Partial<TaskData> = this.model.toCreateData()
        let isValid = true

        if (data.id === undefined) {
            isValid = false
            errors.push(this.errorMessages?.idRequired)
        }

        if (data.dueAt !== undefined && !this.isValidDue(data.dueAt)) {
            isValid = false
            errors.push(this.errorMessages?.dueWrong)
        }

        if (!isValid) {
            ValidationError.throwUpdateData(this.model.getModelName(), errors)
        }

        return isValid
    }

    private isValidDue(dueAt: Date | undefined): boolean {
        if (!dueAt || isNaN(dueAt.getTime())) return false
        return dueAt > new Date()
    }
}