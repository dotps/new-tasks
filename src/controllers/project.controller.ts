import {Request, Response} from "express";
import {CompletedTasksFilter, ProjectData, ValidationType} from "../data/types"
import {IProjectController} from "./project.controller.interface"
import {IProjectService} from "../services/project.service.interface"
import {CurrentUser} from "../data/models/current-user"
import {ITaskService} from "../services/task.service.interface"
import {Project} from "../data/models/project"
import {ProjectValidator} from "../services/validation/project.validator"
import {ResponseSuccess} from "../responses/response-success"
import {ResponseCode} from "../responses/response-code"
import {ResponseError} from "../responses/response-error"
import {QueryHelper} from "../helpers/query-helper"

export class ProjectController implements IProjectController {
    private readonly projectService: IProjectService
    private readonly currentUser: CurrentUser
    private readonly taskService: ITaskService

    constructor(projectService: IProjectService, taskService: ITaskService, currentUser: CurrentUser) {
        this.taskService = taskService
        this.projectService = projectService
        this.currentUser = currentUser
    }

    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const projectData: Partial<ProjectData> = this.projectService.toCreateData(req.body)
            const createdProjectData: ProjectData = await this.projectService.create(projectData, this.currentUser.getId())
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
            const projectData: Partial<ProjectData> = {
                id: Number(req.params.projectId) || undefined
            }
            const validator = new ProjectValidator(projectData)
            if (!validator.validateExistId()) validator.throwValidationError(ValidationType.NotFound)

            const projectsIds = projectData.id ? [projectData.id] : undefined
            const filter: CompletedTasksFilter = {
                projectsIds: projectsIds,
                startDate: QueryHelper.parseDate(req.query?.start_date?.toString()),
                endDate: QueryHelper.parseDate(req.query?.end_date?.toString()),
                includeUser: true,
            }

            const result = await this.taskService.getWorkingTime(filter)
            ResponseSuccess.send(res, result, ResponseCode.Success)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

}
