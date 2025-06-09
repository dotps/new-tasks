import {ProjectData, ProjectWithTasks} from "../data/types"

export interface IProjectService {
    create(data: Partial<ProjectData>): Promise<ProjectData>
    update(data: Partial<ProjectData>): Promise<ProjectData>
    getProjectsWithTasks(userId: number): Promise<ProjectWithTasks[]>
}