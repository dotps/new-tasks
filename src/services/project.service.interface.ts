import {ProjectData, ProjectWithTasks, WorkingTimeData} from "../data/types"

export interface IProjectService {
    create(data: Partial<ProjectData>, userId: number): Promise<ProjectData>
    update(data: Partial<ProjectData>): Promise<ProjectData>
    getProjectsWithTasks(userId: number): Promise<ProjectWithTasks[]>
    toCreateData(body: Partial<ProjectData>): Partial<ProjectData>
    getWorkingTime(projectId?: number, startDate?: Date, endDate?: Date): Promise<WorkingTimeData>
}