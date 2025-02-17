import {User} from "./Models/User"
import {ResponseCode} from "./ResponseCode"
import {ValidationError} from "./ValidationError"

export class CurrentUser {

    private user?: User

    set(user: User) {
        this.user = user
    }

    get() {
        if (!this.user) {
            throw new ValidationError(
                "Авторизация не возможна. Пользователь не найден.",
                ResponseCode.ERROR_UNAUTHORIZED
            )
        }
        return this.user
    }
}