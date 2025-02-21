import {CompletedTasksFilter, TaskData, WorkingTimeData} from "../Data/Types"
import {ITaskService} from "./ITaskService"
import {TaskHelper} from "../Utils/TaskHelper"
import {ValidationError} from "../ValidationError"
import {ITaskDAO} from "../DAO/ITaskDAO"

export class TaskService implements ITaskService {

    private taskDAO: ITaskDAO

    constructor(taskDAO: ITaskDAO) {
        this.taskDAO = taskDAO
    }

    async create(data: Partial<TaskData>): Promise<TaskData> {
        return await this.taskDAO.create(data)
    }

    async update(data: Partial<TaskData>): Promise<TaskData> {
        return await this.taskDAO.update(data)
    }

    async getById(id: number): Promise<TaskData | null> {
        return await this.taskDAO.getById(id)
    }

    async getCompletedTasks(filter: CompletedTasksFilter): Promise<Partial<TaskData>[]> {
        return await this.taskDAO.getCompletedTasks(filter)
    }

    async getWorkingTime(filter: CompletedTasksFilter): Promise<WorkingTimeData> {
        const tasks: Partial<TaskData>[] = await this.taskDAO.getCompletedTasks(filter)
        if (tasks.length === 0) throw ValidationError.EntityNotFound()
        const seconds = TaskHelper.calculateWorkingTime(tasks)
        return {
            totalSeconds: seconds
        }
    }
}
