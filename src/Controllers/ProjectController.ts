import {Request, Response} from "express";
import {CompletedTasksFilter, ProjectData, TaskData, UserData, ValidationType, WorkingTimeData} from "../Data/Types";
import {Project} from "../Models/Project";
import {ResponseSuccess} from "../Responses/ResponseSuccess"
import {ResponseCode} from "../Responses/ResponseCode"
import {ResponseError} from "../Responses/ResponseError"
import {IProjectController} from "./IProjectController"
import {IProjectService} from "../Services/IProjectService"
import {ProjectValidator} from "../Validation/ProjectValidator"
import {CurrentUser} from "../Models/CurrentUser"
import {UserValidator} from "../Validation/UserValidator"
import {QueryHelper} from "../Utils/QueryHelper"
import {TaskHelper} from "../Utils/TaskHelper"
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

            const validator = new ProjectValidator(normalizedData)
            validator.validateCreateDataOrThrow()

            const projectData: ProjectData = await this.projectService.create(normalizedData)
            ResponseSuccess.send(res, projectData, ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.projectService.getProjectsWithTasks(this.currentUser.getId())
            ResponseSuccess.send(res, result, ResponseCode.SUCCESS_CREATED)
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
