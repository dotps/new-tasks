import {ProjectData, ProjectWithTasks} from "../data/types"
import {IProjectService} from "./project.service.interface"
import {IProjectDAO} from "../data/dao/project.dao.interface"

export class ProjectService implements IProjectService {

    private dao: IProjectDAO

    constructor(dao: IProjectDAO) {
        this.dao = dao
    }

    async create(data: Partial<ProjectData>): Promise<ProjectData> {
        return await this.dao.create(data)
    }

    async update(data: Partial<ProjectData>): Promise<ProjectData> {
        return await this.dao.update(data)
    }
    async getProjectsWithTasks(userId: number): Promise<ProjectWithTasks[]> {
        return await this.dao.getProjectsWithTasks(userId)
    }
}