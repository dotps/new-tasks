import {Request, Response} from "express"
import {ProjectData} from "../data/types"
import {IProjectController} from "./project.controller.interface"
import {IProjectService} from "../services/project.service.interface"
import {ResponseSuccess} from "../responses/response-success"
import {ResponseCode} from "../responses/response-code"
import {ResponseError} from "../responses/response-error"
import {QueryHelper} from "../helpers/query-helper"

export class ProjectController implements IProjectController {
    private readonly projectService: IProjectService

    constructor(projectService: IProjectService) {
        this.projectService = projectService
    }

    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const projectData = req.body as Partial<ProjectData>
            const normalizedProjectData: Partial<ProjectData> = this.projectService.toCreateData(projectData)

            const userId = req.currentUser?.getId()
            if (!userId) return ResponseError.sendError(res, "Авторизация не возможна. Пользователь не найден.", ResponseCode.ErrorUnauthorized)

            const createdProjectData: ProjectData = await this.projectService.create(normalizedProjectData, userId)

            ResponseSuccess.send(res, createdProjectData, ResponseCode.SuccessCreated)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.currentUser?.getId()
            if (!userId) return ResponseError.sendError(res, "Авторизация не возможна. Пользователь не найден.", ResponseCode.ErrorUnauthorized)

            const result = await this.projectService.getProjectsWithTasks(userId)

            ResponseSuccess.send(res, result, ResponseCode.Success)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getWorkingTime(req: Request, res: Response): Promise<void> {
        try {
            const {projectId, startDate, endDate} = QueryHelper.parseWorkingTimeParams(req)
            const result = await this.projectService.getWorkingTime(projectId, startDate, endDate)

            ResponseSuccess.send(res, result, ResponseCode.Success)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }
}
