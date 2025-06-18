import {ProjectData, ProjectWithTasks} from "../data/types"

export interface IProjectService {
    create(data: Partial<ProjectData>, userId: number): Promise<ProjectData>
    update(data: Partial<ProjectData>): Promise<ProjectData>
    getProjectsWithTasks(userId: number): Promise<ProjectWithTasks[]>
    toCreateData(body: unknown): Partial<ProjectData>
}