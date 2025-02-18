import {TaskData} from "../Data/Types"
import {ErrorMessages} from "../Models/ErrorMessages"
import {ValidationError} from "../ValidationError"
import {Task} from "../Models/Task"
import {IEntityValidator} from "./IEntityValidator"

export class TaskValidator implements IEntityValidator {
    private model: Task
    private readonly errors: string[]
    private errorMessages: ErrorMessages = {
        idRequired: "Id обязателен.",
        statusRequired: "Статус обязателен.",
        titleRequired: "Заголовок обязателен.",
        taskNotChainToProject: "Задача не привязана к проекту.",
        dueWrong: "Указан некорректный срок выполнения.",
        assignOnlySelf: "Указан некорректный срок выполнения.",
    }

    constructor(model: Task) {
        this.model = model
        this.errors = []
    }

    isValidCreateData(): boolean {
        const data: Partial<TaskData> = this.model.toCreateData()
        let isValid = true

        if (!data.title) {
            isValid = false
            this.errors.push(this.errorMessages?.titleRequired)
        }

        if (!data.projectId) {
            isValid = false
            this.errors.push(this.errorMessages?.taskNotChainToProject)
        }

        if (!this.isValidDue(data.dueAt)) {
            isValid = false
            this.errors.push(this.errorMessages?.dueWrong)
        }

        if (!isValid) {
            ValidationError.throwCreateData(this.model.getModelName(), this.errors)
        }

        return isValid
    }

    isValidUpdateData(): boolean {
        const data: Partial<TaskData> = this.model.toUpdateData()
        let isValid = true

        isValid = this.isExistId(data) && isValid
        isValid = this.isExistAndValidDue(data) && isValid

        if (!isValid) {
            ValidationError.throwUpdateData(this.model.getModelName(), this.errors)
        }

        return isValid
    }

    private isExistId(data: Partial<TaskData>): boolean {
        if (data.id === undefined) {
            this.errors.push(this.errorMessages?.idRequired)
            return false
        }
        return true
    }

    private isExistStatus(data: Partial<TaskData>): boolean {
        if (data.status === undefined) {
            this.errors.push(this.errorMessages?.statusRequired)
            return false
        }
        return true
    }

    private isExistAndValidDue(data: Partial<TaskData>): boolean {
        if (data.dueAt !== undefined && !this.isValidDue(data.dueAt)) {
            this.errors.push(this.errorMessages?.dueWrong)
            return false
        }
        return true
    }

    private isValidDue(dueAt: Date | undefined): boolean {
        if (!dueAt || isNaN(dueAt.getTime())) return false
        return dueAt > new Date()
    }

    // TODO: плохой нейминг
    isValidAssignUser() {
        const data: Partial<TaskData> = this.model.toUpdateData()
        let isValid = true

        isValid = this.isExistId(data) && isValid

        // TODO: добавить userId в схему
        // if (data.userId !== currentUserId) {
        //     isValid = false
        //     errors.push(this.errorMessages?.assignOnlySelf)
        // }

        if (!isValid) {
            ValidationError.throwUpdateData(this.model.getModelName(), this.errors)
        }

        return isValid
    }

    isValidUpdateStatusData() {
        const data: Partial<TaskData> = this.model.toUpdateData()
        let isValid = true

        isValid = this.isExistId(data) && isValid
        isValid = this.isExistStatus(data) && isValid

        if (!isValid) {
            ValidationError.throwUpdateData(this.model.getModelName(), this.errors)
        }

        return isValid
    }
}