import {ORM, UserData} from "./Types"

export class UserService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createUser(userData: UserData): Promise<UserData>  {
        const name = userData.name
        const email = userData.email

        return this.orm.user.create({
            data: {name, email}
        })
    }
}

