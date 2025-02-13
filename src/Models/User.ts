import {UserData} from "../Data/Types"
import {Token} from "../Token"
import {IModel} from "./IModel"
import {ErrorMessages} from "./ErrorMessages"

export class User implements IModel {

    id?: number
    name?: string
    email?: string

    private modelName: string = "Пользователь"
    private errorMessages: ErrorMessages = {
        nameIsRequired: "Имя пользователя обязательно.",
        emailIsWrong: "Неверный e-mail.",
    }

    constructor(data: Partial<UserData>) {
        this.id = Number(data?.id) || undefined
        this.name = data?.name?.toString().trim() || undefined
        this.email = data?.email?.toString().trim() || undefined
    }

    getModelName(): string {
        return this.modelName
    }

    toCreateData(): Partial<UserData> {
        return {
            name: this.name,
            email: this.email,
        }
    }

    toUpdateData(): Partial<UserData> {
        return {
            ...this.toCreateData(),
            id: this.id,
        }
    }

    getToken(): string {
        if (!this?.id) return ""
        return Token.generate(this.id)
    }

    isValidCreateData(errors: string[]): boolean {
        let isValid = true

        if (!this.name) {
            isValid = false
            errors.push(this.errorMessages?.nameIsRequired)
        }

        if (!this.isValidEmail(this.email)) {
            isValid = false
            errors.push(this.errorMessages?.emailIsWrong)
        }

        return isValid
    }

    private isValidEmail(email: string | undefined): boolean {
        if (!email) return false
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(email)
    }

    isValidUpdateData(errors: string[]): boolean {
        return true
    }
}