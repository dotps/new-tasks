import {DataWithId, ValidationType} from "../../data/types"
import {ErrorMessages} from "../../errors/error-messages"
import {ValidationError} from "../../errors/validation-error"

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
                case ValidationType.Create:
                    throw ValidationError.CreateData(this.title, this.errors)
                case ValidationType.Update:
                    throw ValidationError.UpdateData(this.title, this.errors)
                case ValidationType.NotFound:
                    throw ValidationError.EntityNotFound(this.title, this.errors)
            }
        }
    }

    validateExistIdOrThrow() {
        if (!this.validateExistId()) this.throwValidationError(ValidationType.NotFound)
    }
}

