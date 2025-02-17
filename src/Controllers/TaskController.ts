import {Request, Response} from "express";
import {ITaskController} from "./ITaskController";
import {TaskData} from "../Data/Types";
import {Task} from "../Models/Task";
import {ITaskService} from "../Services/ITaskService";
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {TaskValidator} from "../Validation/TaskValidator"
import {CurrentUser} from "../CurrentUser"
import {ValidationError} from "../ValidationError"

export class TaskController implements ITaskController {
    private readonly taskService: ITaskService
    private readonly currentUser: CurrentUser

    constructor(taskService: ITaskService, currentUser: CurrentUser) {
        this.taskService = taskService
        this.currentUser = currentUser
    }

    async createTask(req: Request, res: Response): Promise<void> {
        const task = new Task(req.body)

        try {
            const validator = new TaskValidator(task)
            if (!validator.isValidCreateData()) return
            const taskData: TaskData = await this.taskService.create(task.toCreateData())
            ResponseSuccess.send(res, taskData, ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        const taskData = {
            ...req.body,
            id: Number(req.params.taskId) || undefined
        }
        const task = new Task(taskData)

        try {
            const validator = new TaskValidator(task)
            if (!validator.isValidUpdateData()) return
            const taskData: TaskData = await this.taskService.update(task.toUpdateData())
            ResponseSuccess.send(res, taskData, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    // TODO: назначение исполнителя задачи
    async assignUser(req: Request, res: Response): Promise<void> {
        const taskId = Number(req.params.taskId) || undefined
        const userId = Number(req.body.userId) || undefined
        const currentUserId = this.currentUser.getId()

        // TODO: продолжить

        if (!taskId || !userId) {
            return ResponseError.sendError(res, "Неверные входные данные.", ResponseCode.ERROR_BAD_REQUEST)
        }

        // TODO: нужно ли проверять присутствие userId в БД перед операциями или ORM выдаст ошибку сам?

        try {
            // const validator = new TaskValidator(task)
            // if (!validator.isValidUpdateData()) return
            // const taskData: TaskData = await this.taskService.update(task.toUpdateData())
            // ResponseSuccess.send(res, taskData, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }


}
