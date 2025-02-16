import {UserData} from "../Data/Types"

export interface IUserService {
    create(data: UserData): Promise<UserData>
    update(data: UserData): Promise<UserData>
}