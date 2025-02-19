import {Request, Response} from "express";
import {ITaskController} from "./ITaskController";
import {TaskData, TaskStatus} from "../Data/Types";
import {Task} from "../Models/Task";
import {ITaskService} from "../Services/ITaskService";
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {TaskValidator} from "../Validation/TaskValidator"
import {CurrentUser} from "../CurrentUser"

export class TaskController implements ITaskController {
    private readonly taskService: ITaskService
    private readonly currentUser: CurrentUser

    constructor(taskService: ITaskService, currentUser: CurrentUser) {
        this.taskService = taskService
        this.currentUser = currentUser
    }

    // TODO: протестировать все методы

    async createTask(req: Request, res: Response): Promise<void> {
        try {
            const normalizedData: Partial<TaskData> = new Task(req.body).toCreateData()

            const validator = new TaskValidator(normalizedData)
            if (!validator.isValidCreateData()) return

            const taskData: TaskData = await this.taskService.create(normalizedData)
            ResponseSuccess.send(res, taskData, ResponseCode.SUCCESS_CREATED)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const normalizedData: Partial<TaskData> = new Task(req.body).toUpdateData()
            const updateData: Partial<TaskData> = {
                ...normalizedData,
                id: Number(req.params.taskId) || undefined,
            }

            const validator = new TaskValidator(updateData)
            if (!validator.isValidUpdateData()) return

            const taskData: TaskData = await this.taskService.update(updateData)
            ResponseSuccess.send(res, taskData, ResponseCode.SUCCESS)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const normalizedData: Partial<TaskData> = new Task(req.body).toUpdateData()
            const updateStatusData: Partial<TaskData> = {
                id: Number(req.params.taskId) || undefined,
                status: normalizedData.status
            }

            const validator = new TaskValidator(updateStatusData)
            if (!validator.isValidUpdateStatusData()) return

            const currentTaskData: TaskData | null = await this.taskService.getById(updateStatusData.id!)
            const currentTaskValidator = new TaskValidator(currentTaskData)

            if (!currentTaskValidator.canChangeStatus(this.currentUser.getId())) return

            if (updateStatusData.status === TaskStatus.COMPLETED) {
                updateStatusData.completedAt = new Date()
            }

            const result: TaskData = await this.taskService.update(updateStatusData)
            ResponseSuccess.send(res, result, ResponseCode.SUCCESS)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async assignSelf(req: Request, res: Response): Promise<void> {
        try {
            const assignedUserTaskData: Partial<TaskData> = {
                id: Number(req.params.taskId) || undefined,
                assignedToUserId: this.currentUser.getId()
            }

            const validator = new TaskValidator(assignedUserTaskData)
            if (!validator.isValidAssignSelfData()) return

            const currentTaskData: TaskData | null = await this.taskService.getById(assignedUserTaskData.id!)

            const currentTaskValidator = new TaskValidator(currentTaskData)
            if (!currentTaskValidator.canAssignUser()) return

            const result: TaskData = await this.taskService.update(assignedUserTaskData)
            ResponseSuccess.send(res, result, ResponseCode.SUCCESS)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }
}