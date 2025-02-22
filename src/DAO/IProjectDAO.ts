import {ProjectWithTasks} from "../Data/Types"

export interface IProjectDAO {
    getProjectsWithTasks(userId: number): Promise<ProjectWithTasks[]>
}