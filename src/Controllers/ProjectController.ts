import {Request, Response} from "express";
import {CompletedTasksFilter, ProjectData, TaskData, UserData, ValidationType, WorkingTimeData} from "../Data/Types";
import {Project} from "../Models/Project";
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {IProjectController} from "./IProjectController"
import {IProjectService} from "../Services/IProjectService"
import {ProjectValidator} from "../Validation/ProjectValidator"
import {CurrentUser} from "../CurrentUser"
import {UserValidator} from "../Validation/UserValidator"
import {QueryHelper} from "../Utils/QueryHelper"
import {TaskHelper} from "../Utils/TaskHelper"

export class ProjectController implements IProjectController {
    private readonly projectService: IProjectService
    private readonly currentUser: CurrentUser

    constructor(projectService: IProjectService, currentUser: CurrentUser) {
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
            // TODO: продолжить, можно ли использовать getWorkingTime из Task

            const projectId = Number(req.query?.project)
            const filter: CompletedTasksFilter = {
                projectsIds: ,
                startDate: QueryHelper.parseDate(req.query?.start_date?.toString()),
                endDate: QueryHelper.parseDate(req.query?.end_date?.toString())
            }
            //
            const tasks: Partial<TaskData>[] = await this.taskService.getCompletedTasks(filter)
            console.log(tasks)
            // const seconds = TaskHelper.calculateWorkingTime(tasks)
            // const response: WorkingTimeData = {
            //     seconds: seconds
            // }
            //
            // ResponseSuccess.send(res, response, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

}
