import {DataWithId, ValidationType} from "../../Data/Types"
import {ErrorMessages} from "../../Errors/ErrorMessages"
import {ValidationError} from "../../Errors/ValidationError"

export class Validator<T extends DataWithId> {
    protected readonly data: Partial<T>
    protected readonly errors: string[] = []
    protected readonly title: string = ""
    protected readonly errorMessages: ErrorMessages = {}

    constructor(data: Partial<T> | null) {
        if (!data) throw ValidationError.EntityNotFound(this.title)
        this.data = data
    }

    validateExistId(): boolean {
        if (!this.data.id) {
            this.errors.push(this.errorMessages?.idRequired)
            return false
        }
        return true
    }

    throwValidationError(type: ValidationType) {
        if (this.errors.length > 0) {
            switch (type) {
                case ValidationType.CREATE:
                    throw ValidationError.CreateData(this.title, this.errors)
                case ValidationType.UPDATE:
                    throw ValidationError.UpdateData(this.title, this.errors)
                case ValidationType.NOT_FOUND:
                    throw ValidationError.EntityNotFound(this.title, this.errors)
            }
        }
    }
}

