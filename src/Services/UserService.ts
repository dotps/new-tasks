import {ORM, UserData} from "../Data/Types"
import {User} from "../Models/User"
import {IUserService} from "./IUserService"
import {ObjectHelper} from "../Utils/ObjectHelper"

export class UserService implements IUserService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createUser(data: UserData): Promise<User> {

        const userData = ObjectHelper.excludeField(data, "id")

        data = await this.orm.user.create({
            data: userData
        })

        return new User(data)
    }
}

