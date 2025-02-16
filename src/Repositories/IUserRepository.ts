import {UserData} from "../Data/Types"

export interface IUserRepository {
    create(data: UserData): Promise<UserData>
    update(data: UserData): Promise<UserData>
}