import {ORM, ProjectData, TaskData} from "../Data/Types"
import {Project} from "../Models/Project"
import {ITaskService} from "./ITaskService"
import {Task} from "../Models/Task"

export class TaskService implements ITaskService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createProject(data: ProjectData): Promise<Project> {
        const ormData: ProjectData = await this.orm.project.create({
            data: data
        })
        return new Project(ormData)
    }

    async createTask(data: TaskData): Promise<TaskData>  {
        return this.orm.task.create({
            data: data
        })
    }

    async updateTask(data: TaskData): Promise<TaskData>  {
        return this.orm.task.update({
            where: {
                id: data.id
            },
            data: data
        })
    }

}