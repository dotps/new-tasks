import {Request, Response} from "express";
import {ProjectData, UserData} from "../data/types"
import {IProjectController} from "./project.controller.interface"
import {IProjectService} from "../services/project.service.interface"
import {CurrentUser} from "../data/models/current-user"
import {ResponseSuccess} from "../responses/response-success"
import {ResponseCode} from "../responses/response-code"
import {ResponseError} from "../responses/response-error"
import {QueryHelper} from "../helpers/query-helper"

export class ProjectController implements IProjectController {
    private readonly projectService: IProjectService
    private readonly currentUser: CurrentUser

    constructor(projectService: IProjectService, currentUser: CurrentUser) {
        this.projectService = projectService
        this.currentUser = currentUser
    }

    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const projectData = req.body as Partial<ProjectData>
            const normalizedProjectData: Partial<ProjectData> = this.projectService.toCreateData(projectData)
            const createdProjectData: ProjectData = await this.projectService.create(normalizedProjectData, this.currentUser.getId())
            ResponseSuccess.send(res, createdProjectData, ResponseCode.SuccessCreated)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.projectService.getProjectsWithTasks(this.currentUser.getId())
            ResponseSuccess.send(res, result, ResponseCode.Success)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getWorkingTime(req: Request, res: Response): Promise<void> {
        try {
            const {projectId, startDate, endDate} = QueryHelper.parseWorkingTimeParams(req)
            const result = await this.projectService.getWorkingTime(projectId, startDate, endDate)

            ResponseSuccess.send(res, result, ResponseCode.Success)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }
}
