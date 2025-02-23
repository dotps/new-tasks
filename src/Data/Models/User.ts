import {UserData} from "../Types"
import {SimpleAccessRefreshToken} from "../../Helpers/SimpleAccessRefreshToken"
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
        const userId = this.id || 0
        return {
            id: userId,
            accessToken: SimpleAccessRefreshToken.generateAccessToken(userId),
            refreshToken: SimpleAccessRefreshToken.generateRefreshToken(userId)
        }
    }

    getId(): number {
        return this.id || 0
    }
}