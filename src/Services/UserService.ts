import {UserData} from "../Data/Types"
import {IUserService} from "./IUserService"
import {IRepository} from "../IRepository"

export class UserService implements IUserService {
    private repository: IRepository

    constructor(repository: IRepository) {
        this.repository = repository
    }

    async createUser(userData: UserData): Promise<UserData> {
        return await this.repository.create(userData) as UserData
    }
}

