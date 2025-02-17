import {ORM, UserData} from "../Data/Types"
import {IUserService} from "./IUserService"
import {OrmError} from "../OrmError"
import {ResponseError} from "../ResponseError"
import {ResponseCode} from "../ResponseCode"

export class UserService implements IUserService {

    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async create(data: Partial<UserData>): Promise<UserData> {
        try {
            return await this.orm.user.create({
                data: data as UserData
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }

    async update(data: Partial<UserData>): Promise<UserData> {
        try {
            return await this.orm.user.update({
                where: {
                    id: data.id
                },
                data: data as UserData
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }

    async getById(id: number): Promise<UserData | null> {
        try {
            return await this.orm.user.findUnique({
                where: {
                    id: id
                }
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }
}

