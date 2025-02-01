import {AuthData, ORM, UserData} from "./Types"

export class User {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createUser(name: string, email: string): Promise<UserData>  {
        const user: UserData = await this.orm.user.create({
            data: {name, email}
        })
        console.log(user)
        return user
    }
}

