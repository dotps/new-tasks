import {CompletedTasksFilter, TaskData} from "../Types"
import {ICrudDAO} from "./ICrudDAO"

export interface ITaskDAO extends ICrudDAO<TaskData> {
    getCompletedTasks(filter: CompletedTasksFilter): Promise<Partial<TaskData>[]>
}

