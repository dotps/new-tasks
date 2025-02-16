import {ProjectData, TaskData} from "../Data/Types"
import {ITaskService} from "./ITaskService"
import {IRepository} from "../Repositories/IRepository"

export class TaskService implements ITaskService {
    private taskRepository: IRepository
    private projectRepository: IRepository

    constructor(taskRepository: IRepository, projectRepository: IRepository) {
        this.projectRepository = projectRepository
        this.taskRepository = taskRepository
    }

    async createProject(data: ProjectData): Promise<ProjectData> {
        return await this.projectRepository.create(data) as ProjectData
    }

    async createTask(data: TaskData): Promise<TaskData>  {
        return await this.taskRepository.create(data) as TaskData
    }

    async updateTask(data: TaskData): Promise<TaskData>  {
        return await this.taskRepository.update(data) as TaskData
    }
}