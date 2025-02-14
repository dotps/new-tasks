import {ORM, UserData} from "../Data/Types"
import {IUserService} from "./IUserService"

export class UserService implements IUserService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createUser(userData: UserData): Promise<UserData> {
        return this.orm.user.create({
            data: userData
        })
    }
}

