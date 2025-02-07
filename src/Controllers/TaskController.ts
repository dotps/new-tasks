/*
import {UserService} from "../Services/UserService"
import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {ORM, ProjectData, TaskData} from "../Data/Types"
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
*/

/*
import { UserService } from "../Services/UserService";
import { Request, Response } from "express";
import { ITaskController } from "./ITaskController";
import { ORM } from "../Data/Types";
import { ResponseCode } from "../ResponseCode";
import { ResponseError } from "../ResponseError";
import { ResponseSuccess } from "../ResponseSuccess";
import { TaskService } from "../Services/TaskService";
import { Project } from "../Models/Project";
import { Task } from "../Models/Task";
import { ITaskService } from "../Services/ITaskService";

export class TaskController implements ITaskController {
    private taskService: ITaskService;

    constructor(orm: ORM) {
        this.taskService = new TaskService(orm);
    }

    async createProject(req: Request, res: Response): Promise<void> {
        const project = new Project(req.body);
        await this.handleCreation(res, project, this.taskService.createProject.bind(this.taskService), "Проект");
    }

    async createTask(req: Request, res: Response): Promise<void> {
        const task = new Task(req.body);
        await this.handleCreation(res, task, this.taskService.createTask.bind(this.taskService), "Задача");
    }

    private async handleCreation(res: Response, entity: any, createMethod: Function, entityName: string): Promise<void> {
        const validationErrors: string[] = [];

        if (!entity.isValidData(validationErrors)) {
            return ResponseError.send(res, `${entityName} не создана. Входные данные не валидны. ${validationErrors.join(" ")}`, ResponseCode.ERROR_BAD_REQUEST);
        }

        try {
            const createdEntity = await createMethod(entity.toData());

            if (!createdEntity?.id) {
                return ResponseError.send(res, `${entityName} не создана.`, ResponseCode.SERVER_ERROR);
            }

            ResponseSuccess.send(res, createdEntity, ResponseCode.SUCCESS_CREATED);
        } catch (errorContext) {
            return ResponseError.send(res, `Ошибка при создании ${entityName.toLowerCase()}.`, ResponseCode.SERVER_ERROR, errorContext);
        }
    }
}
*/

import { Request, Response } from "express";
import { ITaskController } from "./ITaskController";
import { ORM, ProjectData, TaskData } from "../Data/Types";
import { TaskService } from "../Services/TaskService";
import { Project } from "../Models/Project";
import { Task } from "../Models/Task";
import { ITaskService } from "../Services/ITaskService";
import {Entity} from "../Entity"

export class TaskController implements ITaskController {
    private readonly taskService: ITaskService

    constructor(orm: ORM) {
        this.taskService = new TaskService(orm)
    }

    async createProject(req: Request, res: Response): Promise<void> {
        const project = new Project(req.body)
        await Entity.create<Project, ProjectData>(res, project, this.taskService.createProject.bind(this.taskService), "Проект")
    }

    async createTask(req: Request, res: Response): Promise<void> {
        const task = new Task(req.body)
        await Entity.create<Task, TaskData>(res, task, this.taskService.createTask.bind(this.taskService), "Задача")
    }
}
