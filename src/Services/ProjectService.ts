import {ProjectData, ProjectWithTasks} from "../Data/Types"
import {IProjectService} from "./IProjectService"
import {IProjectDAO} from "../DAO/IProjectDAO"

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