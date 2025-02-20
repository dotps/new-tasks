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

    async createTask(req: Request, res: Response): Promise<void> {
        try {
            const normalizedData: Partial<TaskData> = new Task(req.body).toCreateData()

            const validator = new TaskValidator(normalizedData)
            validator.validateCreateDataOrThrow()

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
            validator.validateUpdateDataOrThrow()

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
            validator.validateUpdateStatusDataOrThrow()

            const currentTaskData: TaskData | null = await this.taskService.getById(updateStatusData.id!)
            const currentTaskValidator = new TaskValidator(currentTaskData)

            currentTaskValidator.canChangeStatusOrThrow(this.currentUser.getId())
            if (updateStatusData.status === TaskStatus.COMPLETED) {
                updateStatusData.completedAt = new Date()
            }

            const result: TaskData = await this.taskService.update(updateStatusData)
            ResponseSuccess.send(res, result, ResponseCode.SUCCESS)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async assignUser(req: Request, res: Response): Promise<void> {
        try {
            const assignedUserTaskData: Partial<TaskData> = {
                id: Number(req.params.taskId) || undefined,
                assignedToUserId: this.currentUser.getId()
            }

            const validator = new TaskValidator(assignedUserTaskData)
            validator.validateAssignSelfDataOrThrow()

            const currentTaskData: TaskData | null = await this.taskService.getById(assignedUserTaskData.id!)
            const currentTaskValidator = new TaskValidator(currentTaskData)
            currentTaskValidator.canAssignUserOrThrow()

            const result: TaskData = await this.taskService.update(assignedUserTaskData)
            ResponseSuccess.send(res, result, ResponseCode.SUCCESS)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }
}