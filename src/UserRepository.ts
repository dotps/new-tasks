import {IRepository} from "./IRepository"
import {ORM, UserData} from "./Data/Types"

export class UserRepository implements IRepository {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    create(data: UserData): Promise<UserData> {
        return this.orm.user.create({
            data: data
        })
    }

    update(data: UserData): Promise<UserData> {
        return this.orm.user.update({
            where: {
                id: data.id
            },
            data: data
        })
    }
}