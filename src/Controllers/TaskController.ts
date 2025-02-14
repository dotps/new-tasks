import { Request, Response } from "express";
import { ITaskController } from "./ITaskController";
import {ORM, ProjectData, TaskData} from "../Data/Types";
import { TaskService } from "../Services/TaskService";
import { Project } from "../Models/Project";
import { Task } from "../Models/Task";
import { ITaskService } from "../Services/ITaskService";
import {Entity} from "../Entity"
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"

export class TaskController implements ITaskController {
    private readonly taskService: ITaskService

    constructor(orm: ORM) {
        this.taskService = new TaskService(orm)
    }

    async createProject(req: Request, res: Response): Promise<void> {
        const project = new Project(req.body)

        try {
            const entityData: ProjectData = await Entity.create<Project, ProjectData>(res, project, this.taskService.createProject.bind(this.taskService))
            ResponseSuccess.send(res, entityData, ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async createTask(req: Request, res: Response): Promise<void> {
        const task = new Task(req.body)

        try {
            const entityData: TaskData = await Entity.create<Task, TaskData>(res, task, this.taskService.createTask.bind(this.taskService))
            ResponseSuccess.send(res, entityData, ResponseCode.SUCCESS_CREATED)
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
            const entityData: TaskData = await Entity.update<Task, TaskData>(res, task, this.taskService.updateTask.bind(this.taskService))
            ResponseSuccess.send(res, entityData, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

}
