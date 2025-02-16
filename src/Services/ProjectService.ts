import {ProjectData} from "../Data/Types"
import {IProjectService} from "./IProjectService"
import {IProjectRepository} from "../Repositories/IProjectRepository"

export class ProjectService implements IProjectService {
    private repository: IProjectRepository

    constructor(repository: IProjectRepository) {
        this.repository = repository
    }

    async createProject(data: ProjectData): Promise<ProjectData> {
        return await this.repository.create(data)
    }
}