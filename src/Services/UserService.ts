import {ORM, UserData} from "../Data/Types"
import {User} from "../Models/User"
import {IUserService} from "./IUserService"

export class UserService implements IUserService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createUser(userData: UserData): Promise<User> {
        const createdData: UserData = await this.orm.user.create({
            data: userData
        })

        return new User(createdData)
    }
}

