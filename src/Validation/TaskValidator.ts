import {TaskData, ValidationType} from "../Data/Types"
import {ErrorMessages} from "../Models/ErrorMessages"
import {ValidationError} from "../ValidationError"
import {IEntityValidator} from "./IEntityValidator"
import {Validator} from "./Validator"

// export class TaskValidator implements IEntityValidator {
export class TaskValidator extends Validator<TaskData> {
    // private readonly data: Partial<TaskData>
    // private readonly errors: string[] = []
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
        super(data)
        // if (!data) throw ValidationError.EntityNotFound(this.title)
        // this.data = data
    }

    isValidCreateData(): boolean {
        if (!this.data.title) this.errors.push(this.errorMessages?.titleRequired)
        if (!this.data.projectId) this.errors.push(this.errorMessages?.taskNotChainToProject)
        if (!this.isValidDue(this.data.dueAt)) this.errors.push(this.errorMessages?.dueWrong)
        this.throwValidationError(ValidationType.CREATE)
        return true
    }

    isValidUpdateData(): boolean {
        this.validateExistId()
        this.validateDue() // TODO: тут по неймингам поработать
        this.throwValidationError(ValidationType.UPDATE)
        return true
    }

    // private validateExistTaskId(): boolean {
    //     if (!this.data.id) {
    //         this.errors.push(this.errorMessages?.idRequired)
    //         return false
    //     }
    //     return true
    // }

    private validateExistStatus(): boolean {
        if (!this.data.status) {
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

    private validateDue(): boolean {
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
        this.validateExistId()
        this.isExistAssignedUserId()
        this.throwValidationError(ValidationType.UPDATE)
        return true
    }

    isValidUpdateStatusData() {
        this.validateExistId()
        this.validateExistStatus()
        this.throwValidationError(ValidationType.UPDATE)
        return true
    }

    canChangeStatus(currentUserId: number) {
        this.validateExistId()
        if (this.data.assignedToUserId !== currentUserId) {
            this.errors.push(this.errorMessages?.changeStatusCanOnlySelf)
        }
        this.throwValidationError(ValidationType.UPDATE)
        return true
    }

    canAssignUser() {
        this.validateExistId()
        this.throwValidationError(ValidationType.UPDATE)
        return true
    }

    // throwValidationError(type: ValidationType) {
    //     if (this.errors.length > 0) {
    //         switch (type) {
    //             case ValidationType.CREATE:
    //                 throw ValidationError.CreateData(this.title, this.errors)
    //             case ValidationType.UPDATE:
    //                 throw ValidationError.UpdateData(this.title, this.errors)
    //         }
    //     }
    // }
}

