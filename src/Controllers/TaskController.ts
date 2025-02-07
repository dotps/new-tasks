import {UserService} from "../Services/UserService"
import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {ORM} from "../Data/Types"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {User} from "../Models/User"
import {AuthData} from "../Data/AuthData"
import {ResponseSuccess} from "../ResponseSuccess"
import {ITaskController} from "./ITaskController"
import {TaskService} from "../Services/TaskService"
import {Project} from "../Models/Project"
import {ITaskService} from "../Services/ITaskService"
import {Task} from "../Models/Task"

export class TaskController implements ITaskController {

    private taskService: ITaskService

    constructor(orm: ORM) {
        this.taskService = new TaskService(orm)
    }

    async createProject(req: Request, res: Response): Promise<void> {

        const project = new Project(req.body)
        const validationErrors: string[] = []

        if (!project.isValidData(validationErrors)) {
            return ResponseError.send(res, "Проект не создан. Входные данные не валидны. " + validationErrors.join(" "), ResponseCode.ERROR_BAD_REQUEST)
        }

        try {
            const createdProject = await this.taskService.createProject(project.toData())

            if (!createdProject?.id) {
                return ResponseError.send(res, "Проект не создан.", ResponseCode.SERVER_ERROR)
            }

            ResponseSuccess.send(res, createdProject, ResponseCode.SUCCESS_CREATED)
        }
        catch (errorContext) {
            return ResponseError.send(res, "Ошибка при создании проекта.", ResponseCode.SERVER_ERROR, errorContext)
        }
    }

    async createTask(req: Request, res: Response): Promise<void> {

        const task = new Task(req.body)
        const validationErrors: string[] = []

        if (!task.isValidData(validationErrors)) {
            return ResponseError.send(res, "Задача не создана. Входные данные не валидны. " + validationErrors.join(" "), ResponseCode.ERROR_BAD_REQUEST)
        }

        try {
            const createdTask = await this.taskService.createTask(task.toData())

            if (!createdTask?.id) {
                return ResponseError.send(res, "Задача не создана.", ResponseCode.SERVER_ERROR)
            }

            ResponseSuccess.send(res, createdTask, ResponseCode.SUCCESS_CREATED)
        }
        catch (errorContext) {
            return ResponseError.send(res, "Ошибка при создании задачи.", ResponseCode.SERVER_ERROR, errorContext)
        }
    }

}