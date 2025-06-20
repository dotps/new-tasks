import {Request, Response} from "express"
import {ITaskController} from "./task.controller.interface"
import {ITaskService} from "../services/task.service.interface"
import {ResponseSuccess} from "../responses/response-success"
import {ResponseError} from "../responses/response-error"
import {TaskData} from "../data/types"
import {ResponseCode} from "../responses/response-code"
import {getUserId} from "../helpers/user-helper"

export class TaskController implements ITaskController {
    private readonly taskService: ITaskService

    constructor(taskService: ITaskService) {
        this.taskService = taskService
    }

    async createTask(req: Request, res: Response): Promise<void> {
        try {
            const requestData = req.body as Partial<TaskData>
            const normalizedData: Partial<TaskData> = this.taskService.toCreateData(requestData)
            const createdTaskData: TaskData = await this.taskService.create(normalizedData)

            ResponseSuccess.send(res, createdTaskData, ResponseCode.SuccessCreated)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const requestData = req.body as Partial<TaskData>
            const normalizedData: Partial<TaskData> = this.taskService.toUpdateData(requestData, req.params.taskId)
            const updatedTaskData: TaskData = await this.taskService.update(normalizedData)

            ResponseSuccess.send(res, updatedTaskData, ResponseCode.Success)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const requestData = req.body as Partial<TaskData>
            const updateStatusData: Partial<TaskData> = this.taskService.toUpdateStatusData(requestData, req.params.taskId)

            const userId = getUserId(req.currentUser)
            const result: TaskData = await this.taskService.updateStatus(updateStatusData, userId)

            ResponseSuccess.send(res, result, ResponseCode.Success)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async assignUser(req: Request, res: Response): Promise<void> {
        try {
            const requestData = req.body as Partial<TaskData>
            const normalizedTaskData: Partial<TaskData> = this.taskService.toUpdateData(requestData, req.params.taskId)

            const userId = getUserId(req.currentUser)
            const result: TaskData = await this.taskService.assignUser(userId, normalizedTaskData.id)

            ResponseSuccess.send(res, result, ResponseCode.Success)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }
}