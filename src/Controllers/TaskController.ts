import { Request, Response } from "express";
import { ITaskController } from "./ITaskController";
import { ORM, ProjectData, TaskData } from "../Data/Types";
import { TaskService } from "../Services/TaskService";
import { Project } from "../Models/Project";
import { Task } from "../Models/Task";
import { ITaskService } from "../Services/ITaskService";
import {Entity} from "../Entity"
import {ObjectHelper} from "../Utils/ObjectHelper"

export class TaskController implements ITaskController {
    private readonly taskService: ITaskService

    constructor(orm: ORM) {
        this.taskService = new TaskService(orm)
    }

    async createProject(req: Request, res: Response): Promise<void> {
        const project = new Project(req.body)
        await Entity.create<Project, ProjectData>(res, project, this.taskService.createProject.bind(this.taskService))
    }

    async createTask(req: Request, res: Response): Promise<void> {
        const task = new Task(req.body)
        await Entity.create<Task, TaskData>(res, task, this.taskService.createTask.bind(this.taskService))
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        const taskData = { ...req.body, id: Number(req.params.id) || undefined }
        // console.log(taskData)
        const task = new Task(taskData)
        await Entity.update<Task, TaskData>(res, task, this.taskService.updateTask.bind(this.taskService))
    }

}
