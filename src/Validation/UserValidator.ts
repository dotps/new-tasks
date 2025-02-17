import {UserData} from "../Data/Types"
import {User} from "../Models/User"
import {ErrorMessages} from "../Models/ErrorMessages"
import {ValidationError} from "../ValidationError"
import {IEntityValidator} from "./IEntityValidator"

export class UserValidator implements IEntityValidator {
    private model: User
    private errorMessages: ErrorMessages = {
        nameIsRequired: "Имя пользователя обязательно.",
        emailIsWrong: "Неверный e-mail.",
    }

    constructor(user: User) {
        this.model = user
    }

    isValidCreateData(): boolean {
        const errors: string[] = []
        const data: Partial<UserData> = this.model.toCreateData()
        let isValid = true

        if (!data.name) {
            isValid = false
            errors.push(this.errorMessages?.nameIsRequired)
        }

        if (!this.isValidEmail(data.email)) {
            isValid = false
            errors.push(this.errorMessages?.emailIsWrong)
        }

        if (!isValid) {
            ValidationError.throwCreateData(this.model.getModelName(), errors)
        }

        return isValid
    }

    private isValidEmail(email: string | undefined): boolean {
        if (!email) return false
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(email)
    }

    isValidUpdateData(): boolean {
        return true
    }
}