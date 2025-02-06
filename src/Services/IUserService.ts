import {UserData} from "../Data/Types"
import {User} from "../Models/User"

export interface IUserService {
    createUser(userData: UserData): Promise<User>
}