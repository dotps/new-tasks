import {TaskData} from "../Data/Types"

export interface ITaskService {
    create(data: TaskData): Promise<TaskData>
    update(data: TaskData): Promise<TaskData>
}