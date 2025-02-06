import {ORM, ProjectData} from "../Data/Types"
import {Project} from "../Models/Project"
import {ITaskService} from "./ITaskService"

export class TaskService implements ITaskService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createProject(project: Project): Promise<Project> {
        const createdData: ProjectData = await this.orm.project.create({
            data: project.toData()
        })

        return new Project(createdData)
    }

    async createTask(data: ProjectData): Promise<null>  {
        return null
    }
}

