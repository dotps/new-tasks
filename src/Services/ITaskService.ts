import {ProjectData} from "../Data/Types"
import {Project} from "../Models/Project"

export interface ITaskService {
    createProject(data: Project): Promise<Project>
    createTask(data: ProjectData): Promise<null>
}