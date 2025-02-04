import {UserData} from "../Data/Types"
import {Token} from "../Token"

export class User {

    private readonly userData: UserData

    constructor(data: any) {
        this.userData = {
            id: Number(data?.id) || 0,
            name: data?.name?.toString().trim() || "",
            email: data?.email?.toString().trim() || "",
            createdAt: data?.createdAt || new Date()
        }
    }

    get data(): UserData {
        return this.userData
    }

    getToken(): string {
        return Token.generate(this.data.id)
    }

    isValidData(errors: string[]): boolean {
        let isValid = true

        if (!this.data.name) {
            isValid = false
            errors.push("Имя пользователя обязательно.")
        }

        if (!this.isValidEmail(this.data.email)) {
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