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
            id: Number(req.params.id) || undefined
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

}
