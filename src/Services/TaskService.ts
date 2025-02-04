import {ORM, ProjectData} from "../Data/Types"
import {Project} from "../Models/Project"
import {ITaskService} from "./ITaskService"
import {ObjectHelper} from "../Utils/ObjectHelper"

export class TaskService implements ITaskService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createProject(data: ProjectData): Promise<Project> {

        const projectData  = ObjectHelper.excludeField(data, "id")

        data = await this.orm.project.create({
            data: projectData
        })

        return new Project(data)
    }

    async createTask(data: ProjectData): Promise<null>  {
        return null
    }
}

