import {CompletedTasksFilter, TaskData, WorkingTimeData} from "../Data/Types"

export interface ITaskService {
    create(data: Partial<TaskData>): Promise<TaskData>
    update(data: Partial<TaskData>): Promise<TaskData>
    getById(id: number): Promise<TaskData | null>
    getCompletedTasks(filter: CompletedTasksFilter): Promise<Partial<TaskData>[]>
    getWorkingTime(filter: CompletedTasksFilter): Promise<WorkingTimeData>
}

