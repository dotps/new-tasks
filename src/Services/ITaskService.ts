import {ProjectData, TaskData} from "../Data/Types"
import {Project} from "../Models/Project"
import {Task} from "../Models/Task"

export interface ITaskService {
    createProject(data: ProjectData): Promise<ProjectData>
    createTask(data: TaskData): Promise<TaskData>
    updateTask(data: TaskData): Promise<TaskData>
}