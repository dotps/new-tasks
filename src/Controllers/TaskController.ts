import {Request, Response} from "express";
import {ITaskController} from "./ITaskController";
import {TaskData, UserData} from "../Data/Types";
import {Task} from "../Models/Task";
import {ITaskService} from "../Services/ITaskService";
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {CreateEntityCommand} from "../Commands/CreateEntityCommand"
import {UpdateEntityCommand} from "../Commands/UpdateEntityCommand"
import {UserValidator} from "../Validation/UserValidator"
import {TaskValidator} from "../Validation/TaskValidator"

export class TaskController implements ITaskController {
    private readonly taskService: ITaskService

    constructor(taskService: ITaskService) {
        this.taskService = taskService
    }

    async createTask(req: Request, res: Response): Promise<void> {
        const task = new Task(req.body)

        try {
            // const createCommand = new CreateEntityCommand<Task, TaskData>(task, this.taskService.create.bind(this.taskService))
            // const taskData: TaskData = await createCommand.execute()
            const validator = new TaskValidator(task)
            if (!validator.isValidCreateData()) return
            const taskData: TaskData = await this.taskService.create(task.toCreateData() as TaskData)
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
            // const updateCommand = new UpdateEntityCommand<Task, TaskData>(task, this.taskService.update.bind(this.taskService))
            // const entityData: TaskData = await updateCommand.execute()
            const validator = new TaskValidator(task)
            if (!validator.isValidUpdateData()) return
            const taskData: TaskData = await this.taskService.update(task.toUpdateData() as TaskData)
            ResponseSuccess.send(res, taskData, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

}
