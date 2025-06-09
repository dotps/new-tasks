import {UserData} from "../data/types"

export interface IUserService {
    create(data: Partial<UserData>): Promise<UserData>
    update(data: Partial<UserData>): Promise<UserData>
    getById(id: number): Promise<UserData | null>
}