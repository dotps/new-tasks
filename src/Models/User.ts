import {UserData} from "../Data/Types"
import {Token} from "../Token"

export class User {

    id?: number
    name: string
    email: string
    createdAt: Date

    constructor(data: Partial<UserData>) {
        if (data?.id) this.id = Number(data?.id)
        this.name = data?.name?.toString().trim() || ""
        this.email = data?.email?.toString().trim() || ""
        this.createdAt = data?.createdAt || new Date()
    }

    toData(): UserData {
        return Object.assign({}, this) as UserData
    }

    getToken(): string {
        if (!this?.id) return ""
        return Token.generate(this.id)
    }

    isValidData(errors: string[]): boolean {
        let isValid = true

        if (!this.name) {
            isValid = false
            errors.push("Имя пользователя обязательно.")
        }

        if (!this.isValidEmail(this.email)) {
            isValid = false
            errors.push("Неверный e-mail.")
        }

        return isValid
    }

    private isValidEmail(email: string): boolean {
        if (!email) return false
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(email)
    }
}