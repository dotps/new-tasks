import {UserData} from "../Data/Types"
import {IUserService} from "./IUserService"
import {IUserDAO} from "../Data/DAO/IUserDAO"
import {ITokenService} from "./ITokenService"

export class UserService implements IUserService {

    private readonly dao: IUserDAO

    constructor(userDAO: IUserDAO) {
        this.dao = userDAO
    }

    async create(data: Partial<UserData>): Promise<UserData> {
        return await this.dao.create(data)
    }

    async update(data: Partial<UserData>): Promise<UserData> {
        return await this.dao.update(data)
    }

    async getById(id: number): Promise<UserData | null> {
        return await this.dao.getById(id)
    }
}

