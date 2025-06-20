import {User} from "../data/models/user"
import {ValidationError} from "../errors/validation-error"
import {ResponseCode} from "../responses/response-code"

export const getUserId = (user: User | undefined): number => {
    if (!user) {
        throw new ValidationError(
            "Авторизация не возможна. Пользователь не найден.",
            ResponseCode.ErrorUnauthorized
        )
    }

    return user.getId()
}