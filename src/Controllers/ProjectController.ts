import {Request, Response} from "express";
import {ProjectData} from "../Data/Types";
import {Project} from "../Models/Project";
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {CreateEntityCommand} from "../Commands/CreateEntityCommand"
import {IProjectController} from "./IProjectController"
import {IProjectService} from "../Services/IProjectService"

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
            console.log("++++++++++++++++")
            console.log(error)
            ResponseError.send(res, error)
        }
    }
}
