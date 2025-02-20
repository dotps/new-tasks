import {UserData, ValidationType} from "../Data/Types"
import {ErrorMessages} from "../Models/ErrorMessages"
import {Validator} from "./Validator"

export class UserValidator extends Validator<UserData> {
    override readonly title: string = "Пользователь"
    override readonly errorMessages: ErrorMessages = {
        nameIsRequired: "Имя пользователя обязательно.",
        emailIsWrong: "Неверный e-mail.",
    }

    constructor(data: Partial<UserData> | null) {
        super(data)
    }

    validateCreateDataOrThrow(): void {
        if (!this.data.name) this.errors.push(this.errorMessages?.nameIsRequired)
        if (!this.isValidEmail(this.data.email)) this.errors.push(this.errorMessages?.emailIsWrong)
        this.throwValidationError(ValidationType.CREATE)
    }

    private isValidEmail(email: string | undefined): boolean {
        if (!email) return false
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(email)
    }
}