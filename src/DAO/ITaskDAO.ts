import {CompletedTasksFilter, TaskData} from "../Data/Types"

export interface ITaskDAO {
    getCompletedTasks(filter: CompletedTasksFilter): Promise<Partial<TaskData>[]>
}

