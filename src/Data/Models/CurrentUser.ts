import {User} from "./User"
import {ResponseCode} from "../../Responses/ResponseCode"
import {ValidationError} from "../../Errors/ValidationError"

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

    getId(): number {
        return this.get().getId()
    }
}