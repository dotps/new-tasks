import {ProjectData, ProjectWithTasks} from "../Data/Types"
import {ICrudDAO} from "./ICrudDAO"

export interface IProjectDAO extends ICrudDAO<ProjectData> {
    getProjectsWithTasks(userId: number): Promise<ProjectWithTasks[]>
}