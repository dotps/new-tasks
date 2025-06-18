import {ProjectData, ProjectWithTasks} from "../data/types"
import {IProjectService} from "./project.service.interface"
import {IProjectDAO} from "../data/dao/project.dao.interface"
import {Project} from "../data/models/project"
import {ProjectValidator} from "./validation/project.validator"

export class ProjectService implements IProjectService {

    private dao: IProjectDAO

    constructor(dao: IProjectDAO) {
        this.dao = dao
    }

    toCreateData(data: unknown): Partial<ProjectData> {
        return new Project(data as Partial<ProjectData>).toCreateData()
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
}