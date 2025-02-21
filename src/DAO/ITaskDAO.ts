import {CompletedTasksFilter, TaskData} from "../Data/Types"

export interface ITaskDAO {
    create(data: Partial<TaskData>): Promise<TaskData>
    update(data: Partial<TaskData>): Promise<TaskData>
    getById(id: number): Promise<TaskData | null>
    getCompletedTasks(filter: CompletedTasksFilter): Promise<Partial<TaskData>[]>
}

