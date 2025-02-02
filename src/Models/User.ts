import {AuthData, ORM, UserData} from "./Types"

export class User {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createUser(name: string, email: string): Promise<UserData | null>  {
        // try {
            return await this.orm.user.create({
                data: {name, email}
            })
        // }
        // catch (e) {
        //     console.log(e)
        //     return null
        // }
    }
}

