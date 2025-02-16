import {Request, Response} from "express";
import {ITaskController} from "./ITaskController";
import {TaskData} from "../Data/Types";
import {Task} from "../Models/Task";
import {ITaskService} from "../Services/ITaskService";
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {CreateEntityCommand} from "../Commands/CreateEntityCommand"
import {UpdateEntityCommand} from "../Commands/UpdateEntityCommand"

export class TaskController implements ITaskController {
    private readonly taskService: ITaskService

    constructor(taskService: ITaskService) {
        this.taskService = taskService
    }

    async createTask(req: Request, res: Response): Promise<void> {
        const task = new Task(req.body)

        try {
            const createCommand = new CreateEntityCommand<Task, TaskData>(task, this.taskService.create.bind(this.taskService))
            const taskData: TaskData = await createCommand.execute()
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
            const updateCommand = new UpdateEntityCommand<Task, TaskData>(task, this.taskService.update.bind(this.taskService))
            const entityData: TaskData = await updateCommand.execute()
            ResponseSuccess.send(res, entityData, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

}
