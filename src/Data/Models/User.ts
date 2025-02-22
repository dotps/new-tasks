import {UserData} from "../Types"
import {Token} from "../../Helpers/Token"
import {IModel} from "./IModel"
import {AuthData} from "../AuthData"

export class User implements IModel {

    private readonly id?: number
    private readonly name?: string
    private readonly email?: string

    private modelName: string = "Пользователь"

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

    toAuthData(): AuthData {
        return {
            id: this.id || 0,
            token: this.getToken()
        }
    }

    getToken(): string {
        if (!this?.id) return ""
        return Token.generate(this.id)
    }

    getId(): number {
        return this.id || 0
    }
}