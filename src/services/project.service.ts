import {CompletedTasksFilter, ProjectData, ProjectWithTasks, ValidationType, WorkingTimeData} from "../data/types"
import {IProjectService} from "./project.service.interface"
import {IProjectDAO} from "../data/dao/project.dao.interface"
import {Project} from "../data/models/project"
import {ProjectValidator} from "./validation/project.validator"
import {QueryHelper} from "../helpers/query-helper"
import {ITaskService} from "./task.service.interface"

export class ProjectService implements IProjectService {

    private readonly dao: IProjectDAO
    private readonly taskService: ITaskService

    constructor(dao: IProjectDAO, taskService: ITaskService) {
        this.taskService = taskService
        this.dao = dao
    }

    toCreateData(data: Partial<ProjectData>): Partial<ProjectData> {
        return new Project(data).toCreateData()
    }

    async create(data: Partial<ProjectData>, userId: number): Promise<ProjectData> {
        const projectData: Partial<ProjectData> = {
            ...data,
            userId: userId
        }

        const validator = new ProjectValidator(projectData)
        validator.validateCreateDataOrThrow()

        return await this.dao.create(projectData)
    }

    async update(data: Partial<ProjectData>): Promise<ProjectData> {
        return await this.dao.update(data)
    }

    async getProjectsWithTasks(userId: number): Promise<ProjectWithTasks[]> {
        return await this.dao.getProjectsWithTasks(userId)
    }

    async getWorkingTime(projectId?: number, startDate?: Date, endDate?: Date): Promise<WorkingTimeData> {
        const projectData: Partial<ProjectData> = {id: projectId}

        const validator = new ProjectValidator(projectData)
        if (!validator.validateExistId()) validator.throwValidationError(ValidationType.NotFound)

        const filter: CompletedTasksFilter = {
            projectsIds: projectId ? [projectId] : undefined,
            startDate: startDate,
            endDate: endDate,
            includeUser: true,
        }

        return this.taskService.getWorkingTime(filter)
    }

}