import {ORM, UserData} from "../Data/Types"
import {IUserRepository} from "./IUserRepository"

export class UserRepository implements IUserRepository {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async create(data: UserData): Promise<UserData> {
        return this.orm.user.create({
            data: data
        })
    }

    async update(data: UserData): Promise<UserData> {
        return this.orm.user.update({
            where: {
                id: data.id
            },
            data: data
        })
    }
}