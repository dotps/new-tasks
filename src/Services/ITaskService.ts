import {TaskData} from "../Data/Types"

export interface ITaskService {
    createTask(data: TaskData): Promise<TaskData>
    updateTask(data: TaskData): Promise<TaskData>
}