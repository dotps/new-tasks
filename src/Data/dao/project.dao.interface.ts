import {ProjectData, ProjectWithTasks} from "../types"
import {ICrudDAO} from "./crud.dao.interface"

export interface IProjectDAO extends ICrudDAO<ProjectData> {
    getProjectsWithTasks(userId: number): Promise<ProjectWithTasks[]>
}