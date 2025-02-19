import {ValidationType} from "../Data/Types"
import {ErrorMessages} from "../Models/ErrorMessages"
import {ValidationError} from "../ValidationError"

export type DataWithId = {
    id: number
}

// export class Validator<T extends DataWithId> implements IEntityValidator {
export class Validator<T extends DataWithId> {
// export class Validator<T> {
    protected readonly data: Partial<T>
    protected readonly errors: string[] = []
    protected readonly title: string = ""
    protected readonly errorMessages: ErrorMessages = {}

    // constructor(data: Partial<T> | null) {
    constructor(data: Partial<T> | null) {
        if (!data) throw ValidationError.EntityNotFound(this.title)
        this.data = data
    }

    // TODO: как прокинуть id в родителя
    protected validateExistId(): boolean {
        if (!this.data.id) {
            this.errors.push(this.errorMessages?.idRequired)
            return false
        }
        return true
    }

    protected throwValidationError(type: ValidationType) {
        if (this.errors.length > 0) {
            switch (type) {
                case ValidationType.CREATE:
                    throw ValidationError.CreateData(this.title, this.errors)
                case ValidationType.UPDATE:
                    throw ValidationError.UpdateData(this.title, this.errors)
            }
        }
    }
}

