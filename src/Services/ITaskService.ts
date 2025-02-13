import {ProjectData, TaskData} from "../Data/Types"
import {Project} from "../Models/Project"
import {Task} from "../Models/Task"

export interface ITaskService {
    createProject(data: ProjectData): Promise<Project>
    createTask(data: TaskData): Promise<Task>
    updateTask(data: TaskData): Promise<Task>
}