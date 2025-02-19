import {TaskData} from "../Data/Types"
import {ErrorMessages} from "../Models/ErrorMessages"
import {ValidationError} from "../ValidationError"
import {IEntityValidator} from "./IEntityValidator"

export class TaskValidator implements IEntityValidator {
    private readonly data: Partial<TaskData>
    private readonly errors: string[] = []
    private readonly title: string = "Задача"
    private readonly errorMessages: ErrorMessages = {
        idRequired: "Id обязателен.",
        statusRequired: "Статус обязателен.",
        titleRequired: "Заголовок обязателен.",
        taskNotChainToProject: "Задача не привязана к проекту.",
        dueWrong: "Указан некорректный срок выполнения.",
        changeStatusCanOnlySelf: "Только исполнитель задачи может изменить её статус.",
        assignedToUserRequired: "Id исполнителя обязателен.",
    }

    constructor(data: Partial<TaskData> | null) {
        if (!data) throw ValidationError.EntityNotFound(this.title)
        this.data = data
    }

    isValidCreateData(): boolean {
        if (!this.data.title) this.errors.push(this.errorMessages?.titleRequired)
        if (!this.data.projectId) this.errors.push(this.errorMessages?.taskNotChainToProject)
        if (!this.isValidDue(this.data.dueAt)) this.errors.push(this.errorMessages?.dueWrong)
        if (this.errors.length > 0) throw ValidationError.CreateData(this.title, this.errors)
        return true
    }

    isValidUpdateData(): boolean {
        let isValid = true

        isValid = this.isExistId() && isValid
        isValid = this.isExistAndValidDue() && isValid

        if (!isValid) {
            throw ValidationError.UpdateData(this.title, this.errors)
        }

        return isValid
    }

    private isExistId(): boolean {
        if (this.data.id === undefined) {
            this.errors.push(this.errorMessages?.idRequired)
            return false
        }
        return true
    }

    private isExistStatus(): boolean {
        if (this.data.status === undefined) {
            this.errors.push(this.errorMessages?.statusRequired)
            return false
        }
        return true
    }

    private isExistAssignedUserId(): boolean {
        if (!this.data.assignedToUserId) {
            this.errors.push(this.errorMessages?.assignedToUserRequired)
            return false
        }
        return true
    }

    private isExistAndValidDue(): boolean {
        if (this.data.dueAt !== undefined && !this.isValidDue(this.data.dueAt)) {
            this.errors.push(this.errorMessages?.dueWrong)
            return false
        }
        return true
    }

    private isValidDue(dueAt: Date | undefined): boolean {
        if (!dueAt || isNaN(dueAt.getTime())) return false
        return dueAt > new Date()
    }

    isValidAssignSelfData() {
        this.isExistId()
        this.isExistAssignedUserId()
        if (this.errors.length > 0) throw ValidationError.UpdateData(this.title, this.errors)
        return true
    }

    isValidUpdateStatusData() {
        let isValid = true

        isValid = this.isExistId() && isValid
        isValid = this.isExistStatus() && isValid

        if (!isValid) {
            throw ValidationError.UpdateData(this.title, this.errors)
        }

        return isValid
    }

    canChangeStatus(currentUserId: number) {
        let isValid = true

        isValid = this.isExistId() && isValid
        if (this.data.assignedToUserId !== currentUserId) {
            this.errors.push(this.errorMessages?.changeStatusCanOnlySelf)
            isValid = false
        }

        if (!isValid) {
            throw ValidationError.UpdateData(this.title, this.errors)
        }

        return isValid
    }

    canAssignUser() {
        let isValid = true

        isValid = this.isExistId() && isValid

        if (!isValid) {
            throw ValidationError.UpdateData(this.title, this.errors)
        }

        return isValid
    }
}