import {Request, Response} from "express";
import {ProjectData, TaskData, UserData} from "../Data/Types";
import {Project} from "../Models/Project";
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {CreateEntityCommand} from "../Commands/CreateEntityCommand"
import {IProjectController} from "./IProjectController"
import {IProjectService} from "../Services/IProjectService"
import {Task} from "../Models/Task"
import {UpdateEntityCommand} from "../Commands/UpdateEntityCommand"
import {AuthData} from "../Data/AuthData"
import {User} from "../Models/User"

export class ProjectController implements IProjectController {
    private readonly projectService: IProjectService

    constructor(projectService: IProjectService) {
        this.projectService = projectService
    }

    async createProject(req: Request, res: Response): Promise<void> {
        const project = new Project(req.body)

        try {
            const createCommand = new CreateEntityCommand<Project, ProjectData>(project, this.projectService.create.bind(this.projectService))
            const projectData: ProjectData = await createCommand.execute()
            ResponseSuccess.send(res, projectData, ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            console.log(error)
            ResponseError.send(res, error)
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {

        // Теперь у вас есть токен, и вы можете использовать его для дальнейшей обработки
        // console.log(token);

        // console.log(req.headers.authorization.)
        const userId = Number(req.headers.authorization) || undefined
        console.log(userId)
        const user = new User({id: userId})
        // const a = AuthData()
        console.log(user)

        // const taskData = {
        //     ...req.body,
        //     id: Number(req.params.id) || undefined
        // }
        // const task = new Task(taskData)


    }
}
