import {CompletedTasksFilter, TaskData} from "../types"
import {ICrudDAO} from "./crud.dao.interface"

export interface ITaskDAO extends ICrudDAO<TaskData> {
    getCompletedTasks(filter: CompletedTasksFilter): Promise<Partial<TaskData>[]>
}

