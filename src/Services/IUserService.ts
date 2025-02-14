import {UserData} from "../Data/Types"
import {User} from "../Models/User"
import {AuthData} from "../Data/AuthData"

export interface IUserService {
    createUser(userData: UserData): Promise<UserData>
}