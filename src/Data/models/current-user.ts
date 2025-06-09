import {User} from "./user"
import {ValidationError} from "../../errors/validation-error"
import {ResponseCode} from "../../responses/response-code"

export class CurrentUser {

    private user?: User

    set(user: User) {
        this.user = user
    }

    get() {
        if (!this.user) {
            throw new ValidationError(
                "Авторизация не возможна. Пользователь не найден.",
                ResponseCode.ErrorUnauthorized
            )
        }
        return this.user
    }

    getId(): number {
        return this.get().getId()
    }
}