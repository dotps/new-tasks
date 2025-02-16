import {UserData} from "../Data/Types"

export interface IUserService {
    createUser(userData: UserData): Promise<UserData>
}