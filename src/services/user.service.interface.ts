import {ProjectData, UserData, WorkingTimeData} from "../data/types"
import {Request} from "express"

export interface IUserService {
    create(data: Partial<UserData>): Promise<UserData>
    update(data: Partial<UserData>): Promise<UserData>
    getById(id: number): Promise<UserData | null>
    toCreateData(body: Partial<UserData>): Partial<UserData>
    getWorkingTime(userId?: number, projectId?: number[], startDate?: Date, endDate?: Date): Promise<WorkingTimeData>
}