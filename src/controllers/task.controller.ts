import {Request, Response} from "express"
import {ITaskController} from "./task.controller.interface"
import {ITaskService} from "../services/task.service.interface"
import {CurrentUser} from "../data/models/current-user"
import {ResponseSuccess} from "../responses/response-success"
import {ResponseError} from "../responses/response-error"
import {TaskData} from "../data/types"
import {ResponseCode} from "../responses/response-code"

export class TaskController implements ITaskController {
    private readonly taskService: ITaskService
    private readonly currentUser: CurrentUser

    constructor(taskService: ITaskService, currentUser: CurrentUser) {
        this.taskService = taskService
        this.currentUser = currentUser
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
            const result: TaskData = await this.taskService.updateStatus(updateStatusData, this.currentUser.getId())

            ResponseSuccess.send(res, result, ResponseCode.Success)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async assignUser(req: Request, res: Response): Promise<void> {
        try {
            const requestData = req.body as Partial<TaskData>
            const normalizedTaskData: Partial<TaskData> = this.taskService.toUpdateData(requestData, req.params.taskId)
            const result: TaskData = await this.taskService.assignUser(this.currentUser.getId(), normalizedTaskData.id)

            ResponseSuccess.send(res, result, ResponseCode.Success)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }
}