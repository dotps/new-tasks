import {ProjectData, UserData, WorkingTimeData} from "../data/types"

export interface IUserService {
    create(data: Partial<UserData>): Promise<UserData>
    update(data: Partial<UserData>): Promise<UserData>
    getById(id: number): Promise<UserData | null>
    toCreateData(body: unknown): Partial<ProjectData>
    getWorkingTime(userId?: number, projectId?: number[], startDate?: Date, endDate?: Date): Promise<WorkingTimeData>
}