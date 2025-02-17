import {Request, Response} from "express";
import {ProjectData} from "../Data/Types";
import {Project} from "../Models/Project";
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {IProjectController} from "./IProjectController"
import {IProjectService} from "../Services/IProjectService"
import {ProjectValidator} from "../Validation/ProjectValidator"
import {CurrentUser} from "../CurrentUser"

export class ProjectController implements IProjectController {
    private readonly projectService: IProjectService
    private readonly currentUser: CurrentUser

    constructor(projectService: IProjectService, currentUser: CurrentUser) {
        this.projectService = projectService
        this.currentUser = currentUser
    }

    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const project = new Project(req.body)
            const validator = new ProjectValidator(project)
            if (!validator.isValidCreateData()) return
            const projectData: ProjectData = await this.projectService.create(project.toCreateData())
            ResponseSuccess.send(res, projectData, ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const user = this.currentUser.get()
            // const result = await this.projectService.getAll()
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }
}
