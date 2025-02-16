import {UserData} from "../Data/Types"
import {IUserService} from "./IUserService"
import {IUserRepository} from "../Repositories/IUserRepository"

export class UserService implements IUserService {
    private repository: IUserRepository

    constructor(repository: IUserRepository) {
        this.repository = repository
    }

    async createUser(data: UserData): Promise<UserData> {
        return await this.repository.create(data)
    }
}

