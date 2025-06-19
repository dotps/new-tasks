import {CompletedTasksFilter, TaskData, WorkingTimeData} from "../data/types"
import {ITaskService} from "./task.service.interface"
import {ITaskDAO} from "../data/dao/task.dao.interface"
import {ValidationError} from "../errors/validation-error"
import {TaskHelper} from "../helpers/task-helper"
import {Task} from "../data/models/task"
import {TaskValidator} from "./validation/task.validator"
import {TaskStatus} from "@prisma/client"

export class TaskService implements ITaskService {

    private dao: ITaskDAO

    constructor(taskDAO: ITaskDAO) {
        this.dao = taskDAO
    }

    async create(data: Partial<TaskData>): Promise<TaskData> {
        const validator = new TaskValidator(data)
        validator.validateCreateDataOrThrow()

        return await this.dao.create(data)
    }

    async update(data: Partial<TaskData>): Promise<TaskData> {
        const validator = new TaskValidator(data)
        validator.validateUpdateDataOrThrow()

        return await this.dao.update(data)
    }

    async updateStatus(data: Partial<TaskData>, userId: number): Promise<TaskData> {
        const validator = new TaskValidator(data)
        validator.validateUpdateStatusDataOrThrow()

        const currentTaskData: TaskData | null = await this.getById(data.id!)
        const currentTaskValidator = new TaskValidator(currentTaskData)

        currentTaskValidator.canChangeStatusOrThrow(userId)

        if (data.status === TaskStatus.Completed) {
            data.completedAt = new Date()
        }

        return await this.update(data)
    }

    async assignUser(userId: number, taskId: number | undefined): Promise<TaskData> {
        const assignedUserTaskData: Partial<TaskData> = {
            id: taskId,
            assignedToUserId: userId
        }

        const validator = new TaskValidator(assignedUserTaskData)
        validator.validateAssignSelfDataOrThrow()

        const currentTaskData: TaskData | null = await this.getById(assignedUserTaskData.id!)
        const currentTaskValidator = new TaskValidator(currentTaskData)
        currentTaskValidator.canAssignUserOrThrow()

        return await this.update(assignedUserTaskData)
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

    toCreateData(data: Partial<TaskData>): Partial<TaskData> {
        return new Task(data).toCreateData()
    }

    toUpdateData(data: Partial<TaskData>, taskId: string | number): Partial<TaskData> {
        const normalizedData: Partial<TaskData> = new Task(data).toUpdateData()

        return {
            ...normalizedData,
            id: Number(taskId) || undefined,
        }
    }

    toUpdateStatusData(data: Partial<TaskData>, taskId: string | number): Partial<TaskData> {
        const normalizedData: Partial<TaskData> = new Task(data).toUpdateData()

        return  {
            id: Number(taskId) || undefined,
            status: normalizedData.status
        }
    }

    toUpdateAssignedUserData(taskId: string | number, userId: number): Partial<TaskData> {
        return  {
            id: Number(taskId) || undefined,
            assignedToUserId: userId
        }
    }
}
