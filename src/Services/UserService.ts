import {UserData} from "../Data/Types"
import {IUserService} from "./IUserService"
import {IUserDAO} from "../DAO/IUserDAO"

export class UserService implements IUserService {

    private userDAO: IUserDAO

    constructor(userDAO: IUserDAO) {
        this.userDAO = userDAO
    }

    async create(data: Partial<UserData>): Promise<UserData> {
        return await this.userDAO.create(data)
    }

    async update(data: Partial<UserData>): Promise<UserData> {
        return await this.userDAO.update(data)
    }

    async getById(id: number): Promise<UserData | null> {
        return await this.userDAO.getById(id)
    }
}

