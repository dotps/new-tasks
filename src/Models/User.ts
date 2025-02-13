import {UserData} from "../Data/Types"
import {Token} from "../Token"
import {IModel} from "./IModel"

export type ModelProps = {
    name: string
    errorMessages: ErrorMessages
}

export type ErrorMessages = {
    [key: string]: string
}

export class User implements IModel {

    id?: number
    name: string
    email: string
    createdAt: Date

    constructor(data: Partial<UserData>) {
        if (data?.id) this.id = Number(data.id)
        this.name = data?.name?.toString().trim() || ""
        this.email = data?.email?.toString().trim() || ""
        this.createdAt = data?.createdAt ? new Date(data.createdAt) : new Date()
    }

    get props(): ModelProps {
        return {
            name: "Пользователь",
            errorMessages: {
                nameIsRequired: "Имя пользователя обязательно.",
                emailIsWrong: "Неверный e-mail.",
            },
        }
    }

    toData(): UserData {
        return Object.assign({}, this) as UserData
    }

    getToken(): string {
        if (!this?.id) return ""
        return Token.generate(this.id)
    }

    isValidCreateData(errors: string[]): boolean {
        let isValid = true

        if (!this.name) {
            isValid = false
            errors.push(this.props.errorMessages?.nameIsRequired)
        }

        if (!this.isValidEmail(this.email)) {
            isValid = false
            errors.push(this.props.errorMessages?.emailIsWrong)
        }

        return isValid
    }

    private isValidEmail(email: string): boolean {
        if (!email) return false
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(email)
    }

    isValidUpdateData(errors: string[]): boolean {
        return true
    }
}