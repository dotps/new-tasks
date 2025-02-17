import {Request, Response} from "express";
import {ProjectData} from "../Data/Types";
import {Project} from "../Models/Project";
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {IProjectController} from "./IProjectController"
import {IProjectService} from "../Services/IProjectService"
import {User} from "../Models/User"
import {ProjectValidator} from "../Validation/ProjectValidator"

export class ProjectController implements IProjectController {
    private readonly projectService: IProjectService

    constructor(projectService: IProjectService) {
        this.projectService = projectService
    }

    async createProject(req: Request, res: Response): Promise<void> {
        const project = new Project(req.body)

        try {
            const validator = new ProjectValidator(project)
            if (!validator.isValidCreateData()) return
            const projectData: ProjectData = await this.projectService.create(project.toCreateData() as ProjectData)
            ResponseSuccess.send(res, projectData, ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {

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
