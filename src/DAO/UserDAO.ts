import {ORM, UserData} from "../Data/Types"
import {OrmError} from "../OrmError"
import {IUserDAO} from "./IUserDAO"
import {CrudDAO, ORM2} from "./CrudDAO"
import {Prisma} from "@prisma/client"
import {DefaultArgs} from "@prisma/client/runtime/client"

export class UserDAO extends CrudDAO<UserData> implements IUserDAO {

    private user: Prisma.UserDelegate<DefaultArgs, Prisma.PrismaClientOptions>

    constructor(orm: ORM2) {
        super(orm, 'user')

        this.user = orm.user
    }

    // async create(data: Partial<UserData>): Promise<UserData> {
    //     try {
    //         return await this.orm.user.create({
    //             data: data as UserData
    //         })
    //     }
    //     catch (error) {
    //         throw new OrmError(error)
    //     }
    // }
    //
    // async update(data: Partial<UserData>): Promise<UserData> {
    //     try {
    //         return await this.orm.user.update({
    //             where: {
    //                 id: data.id
    //             },
    //             data: data as UserData
    //         })
    //     }
    //     catch (error) {
    //         throw new OrmError(error)
    //     }
    // }

    async getById(id: number): Promise<UserData | null> {
        try {
            return await this.user.findUnique({
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

