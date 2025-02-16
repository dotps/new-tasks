import {ORM, UserData} from "../Data/Types"
import {IUserService} from "./IUserService"
import {OrmError} from "../OrmError"

export class UserService implements IUserService {

    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async create(data: UserData): Promise<UserData> {
        try {
            return await this.orm.user.create({
                data: data
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }

    async update(data: UserData): Promise<UserData> {
        try {
            return await this.orm.user.update({
                where: {
                    id: data.id
                },
                data: data
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }
}

