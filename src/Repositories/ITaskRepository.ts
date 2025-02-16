import {TaskData} from "../Data/Types"

export interface ITaskRepository {
    create(data: TaskData): Promise<TaskData>
    update(data: TaskData): Promise<TaskData>
}