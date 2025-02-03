import {User} from "../Models/User"

export class AuthData {
    id: number
    token: string

    constructor(user: User) {
        this.id = user.data.id
        this.token = user.getToken()
    }
}