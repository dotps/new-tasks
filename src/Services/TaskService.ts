import {CompletedTasksFilter, TaskData, WorkingTimeData} from "../Data/Types"
import {ITaskService} from "./ITaskService"
import {TaskHelper} from "../Helpers/TaskHelper"
import {ValidationError} from "../Errors/ValidationError"
import {ITaskDAO} from "../Data/DAO/ITaskDAO"

export class TaskService implements ITaskService {

    private dao: ITaskDAO

    constructor(taskDAO: ITaskDAO) {
        this.dao = taskDAO
    }

    async create(data: Partial<TaskData>): Promise<TaskData> {
        return await this.dao.create(data)
    }

    async update(data: Partial<TaskData>): Promise<TaskData> {
        return await this.dao.update(data)
    }

    async getById(id: number): Promise<TaskData | null> {
        return await this.dao.getById(id)
    }

    async getCompletedTasks(filter: CompletedTasksFilter): Promise<Partial<TaskData>[]> {
        return await this.dao.getCompletedTasks(filter)
    }

    async getWorkingTime(filter: CompletedTasksFilter): Promise<WorkingTimeData> {
        const tasks: Partial<TaskData>[] = await this.dao.getCompletedTasks(filter)
        if (tasks.length === 0) throw ValidationError.EntityNotFound()
        const seconds = TaskHelper.calculateWorkingTime(tasks)
        return {
            totalSeconds: seconds
        }
    }
}
