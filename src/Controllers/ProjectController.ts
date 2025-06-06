import {Request, Response} from "express";
import {CompletedTasksFilter, ProjectData, TaskData, ValidationType} from "../Data/Types"
import {Project} from "../Data/Models/Project";
import {ResponseSuccess} from "../Responses/ResponseSuccess"
import {ResponseCode} from "../Responses/ResponseCode"
import {ResponseError} from "../Responses/ResponseError"
import {IProjectController} from "./IProjectController"
import {IProjectService} from "../Services/IProjectService"
import {ProjectValidator} from "../Services/Validation/ProjectValidator"
import {CurrentUser} from "../Data/Models/CurrentUser"
import {QueryHelper} from "../Helpers/QueryHelper"
import {ITaskService} from "../Services/ITaskService"

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
            const normalizedData: Partial<ProjectData> = new Project(req.body).toCreateData()
            const createProjectData: Partial<ProjectData> = {
                ...normalizedData,
                userId: this.currentUser.getId()
            }

            const validator = new ProjectValidator(createProjectData)
            validator.validateCreateDataOrThrow()

            const projectData: ProjectData = await this.projectService.create(createProjectData)
            ResponseSuccess.send(res, projectData, ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.projectService.getProjectsWithTasks(this.currentUser.getId())
            ResponseSuccess.send(res, result, ResponseCode.SUCCESS)
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
            if (!validator.validateExistId()) validator.throwValidationError(ValidationType.NOT_FOUND)

            const projectsIds = projectData.id ? [projectData.id] : undefined
            const filter: CompletedTasksFilter = {
                projectsIds: projectsIds,
                startDate: QueryHelper.parseDate(req.query?.start_date?.toString()),
                endDate: QueryHelper.parseDate(req.query?.end_date?.toString()),
                includeUser: true,
            }

            const result = await this.taskService.getWorkingTime(filter)
            ResponseSuccess.send(res, result, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

}
