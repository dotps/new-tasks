import {CompletedTasksFilter, TaskData, WorkingTimeData} from "../data/types"
import {ITaskService} from "./task.service.interface"
import {ITaskDAO} from "../data/dao/task.dao.interface"
import {ValidationError} from "../errors/validation-error"
import {TaskHelper} from "../helpers/task-helper"

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
        if (tasks.length === 0) throw ValidationError.NotFound(["Нет завершенных задач, согласно переданных данных для фильтрации."])
        const seconds = TaskHelper.calculateWorkingTime(tasks)
        return {
            totalSeconds: seconds
        }
    }
}
