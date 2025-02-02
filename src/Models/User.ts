import {AuthData, ORM, UserData} from "./Types"

export class User {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createUser(name: string, email: string): Promise<UserData>  {
        return this.orm.user.create({
            data: {name, email}
        })
    }
}

