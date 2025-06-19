import {CompletedTasksFilter, TaskData, WorkingTimeData} from "../data/types"

export interface ITaskService {
    create(data: Partial<TaskData>): Promise<TaskData>
    update(data: Partial<TaskData>): Promise<TaskData>
    updateStatus(data: Partial<TaskData>, userId: number): Promise<TaskData>
    assignUser(userId: number, taskId: number| undefined): Promise<TaskData>
    getById(id: number): Promise<TaskData | null>
    getCompletedTasks(filter: CompletedTasksFilter): Promise<Partial<TaskData>[]>
    getWorkingTime(filter: CompletedTasksFilter): Promise<WorkingTimeData>
    toCreateData(data: Partial<TaskData>): Partial<TaskData>
    toUpdateData(data: Partial<TaskData>, taskId: string | number): Partial<TaskData>
    toUpdateStatusData(data: Partial<TaskData>, taskId: string | number): Partial<TaskData>
    toUpdateAssignedUserData(taskId: string | number, userId: number): Partial<TaskData>
}

