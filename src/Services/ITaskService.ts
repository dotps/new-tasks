import {ProjectData} from "../Data/Types"
import {Project} from "../Models/Project"

export interface ITaskService {
    createProject(data: ProjectData): Promise<Project>
    createTask(data: ProjectData): Promise<null>
}