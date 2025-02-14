import { Request, Response } from "express";
import { ITaskController } from "./ITaskController";
import {ORM, ProjectData, TaskData, UserData} from "../Data/Types";
import { TaskService } from "../Services/TaskService";
import { Project } from "../Models/Project";
import { Task } from "../Models/Task";
import { ITaskService } from "../Services/ITaskService";
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {CreateEntityCommand} from "../Commands/CreateEntityCommand"
import {UpdateEntityCommand} from "../Commands/UpdateEntityCommand"

export class TaskController implements ITaskController {
    private readonly taskService: ITaskService

    constructor(orm: ORM) {
        this.taskService = new TaskService(orm)
    }

    async createProject(req: Request, res: Response): Promise<void> {
        const project = new Project(req.body)

        try {
            const createCommand = new CreateEntityCommand<Project, ProjectData>(project, this.taskService.createProject.bind(this.taskService))
            const entityData: ProjectData = await createCommand.execute()
            ResponseSuccess.send(res, entityData, ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async createTask(req: Request, res: Response): Promise<void> {
        const task = new Task(req.body)

        try {
            const createCommand = new CreateEntityCommand<Task, TaskData>(task, this.taskService.createProject.bind(this.taskService))
            const entityData: TaskData = await createCommand.execute()
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
            const updateCommand = new UpdateEntityCommand<Task, TaskData>(task, this.taskService.createProject.bind(this.taskService))
            const entityData: TaskData = await updateCommand.execute()
            ResponseSuccess.send(res, entityData, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

}
