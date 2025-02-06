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
        const createdData: ProjectData = await this.orm.project.create({
            data: data
        })
        return new Project(createdData)
    }

    async createTask(data: TaskData): Promise<Task>  {
        const createdData: TaskData = await this.orm.task.create({
            data: data
        })
        return new Task(createdData)
    }
}

