import {TaskData, ValidationType} from "../Data/Types"
import {ErrorMessages} from "../Models/ErrorMessages"
import {Validator} from "./Validator"

export class TaskValidator extends Validator<TaskData> {
    override readonly title: string = "Задача"
    override readonly errorMessages: ErrorMessages = {
        idRequired: "Id обязателен.",
        statusRequired: "Статус обязателен.",
        titleRequired: "Заголовок обязателен.",
        taskNotChainToProject: "Задача не привязана к проекту.",
        dueWrong: "Указан некорректный срок выполнения.",
        changeStatusCanOnlySelf: "Только исполнитель задачи может изменить её статус.",
        assignedToUserRequired: "Id исполнителя обязателен.",
    }

    constructor(data: Partial<TaskData> | null) {
        super(data)
    }

    validateCreateDataOrThrow(): void {
        if (!this.data.title) this.errors.push(this.errorMessages?.titleRequired)
        if (!this.data.projectId) this.errors.push(this.errorMessages?.taskNotChainToProject)
        if (!this.isValidDue(this.data.dueAt)) this.errors.push(this.errorMessages?.dueWrong)
        this.throwValidationError(ValidationType.CREATE)
    }

    validateUpdateDataOrThrow(): void {
        this.validateExistId()
        this.validateExistDue() // TODO: тут по неймингам поработать
        this.throwValidationError(ValidationType.UPDATE)
    }

    private validateExistStatus(): boolean {
        if (!this.data.status) {
            this.errors.push(this.errorMessages?.statusRequired)
            return false
        }
        return true
    }

    private validateExistAssignedUserId(): boolean {
        if (!this.data.assignedToUserId) {
            this.errors.push(this.errorMessages?.assignedToUserRequired)
            return false
        }
        return true
    }

    private validateExistDue(): boolean {
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

    validateAssignSelfDataOrThrow(): void {
        this.validateExistId()
        this.validateExistAssignedUserId()
        this.throwValidationError(ValidationType.UPDATE)
    }

    validateUpdateStatusDataOrThrow(): void {
        this.validateExistId()
        this.validateExistStatus()
        this.throwValidationError(ValidationType.UPDATE)
    }

    canChangeStatusOrThrow(currentUserId: number): void {
        this.validateExistId()
        if (this.data.assignedToUserId !== currentUserId) {
            this.errors.push(this.errorMessages?.changeStatusCanOnlySelf)
        }
        this.throwValidationError(ValidationType.UPDATE)
    }

    canAssignUserOrThrow(): void {
        this.validateExistId()
        this.throwValidationError(ValidationType.UPDATE)
    }

}

