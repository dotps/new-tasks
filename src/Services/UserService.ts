import {UserData} from "../Data/Types"
import {IUserService} from "./IUserService"
import {IRepository} from "../Repositories/IRepository"

export class UserService implements IUserService {
    private repository: IRepository

    constructor(repository: IRepository) {
        this.repository = repository
    }

    async createUser(data: UserData): Promise<UserData> {
        // return await this.repository.create(data) as UserData
        return await this.repository.create2<UserData>(data)
    }
}

