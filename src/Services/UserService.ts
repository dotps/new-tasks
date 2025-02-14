import {ORM, UserData} from "../Data/Types"
import {IUserService} from "./IUserService"
import {User} from "../Models/User"
import {ValidationError} from "../ValidationError"
import {ResponseCode} from "../ResponseCode"

export class UserService implements IUserService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createUser(userData: UserData): Promise<UserData> {

        // const user = new User(userData)
        // const validationErrors: string[] = []
        //
        // if (!user.isValidCreateData(validationErrors)) {
        //     throw new ApiError(
        //         `Сущность "Пользователь" не создана. Входные данные не валидны. ${validationErrors.join(" ")}`,
        //         ResponseCode.ERROR_BAD_REQUEST
        //     )
        // }

        return this.orm.user.create({
            data: userData
        })
    }
}

