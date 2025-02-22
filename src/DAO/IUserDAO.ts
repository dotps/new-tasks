import {UserData} from "../Data/Types"
import {ICrudDAO} from "./ICrudDAO"

export interface IUserDAO extends ICrudDAO<UserData> {
    // getById(id: number): Promise<UserData | null>
}