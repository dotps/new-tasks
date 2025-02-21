import {ProjectData, ProjectWithTasks} from "../Data/Types"

export interface IProjectDAO {
    create(data: Partial<ProjectData>): Promise<ProjectData>
    update(data: Partial<ProjectData>): Promise<ProjectData>
    getProjectsWithTasks(userId: number): Promise<ProjectWithTasks[]>
}