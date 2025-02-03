import {ORM, UserData} from "../Data/Types"
import {User} from "../Models/User"

export class UserService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createUser(userData: UserData): Promise<User>  {
        const name = userData.name
        const email = userData.email

        userData = await this.orm.user.create({
            data: {name, email}
        })

        return new User(userData)
    }
}

