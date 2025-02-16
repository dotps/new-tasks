import {TaskData} from "../Data/Types"
import {ITaskService} from "./ITaskService"
import {ITaskRepository} from "../Repositories/ITaskRepository"

export class TaskService implements ITaskService {
    private repository: ITaskRepository

    constructor(repository: ITaskRepository) {
        this.repository = repository
    }

    async createTask(data: TaskData): Promise<TaskData>  {
        return await this.repository.create(data)
    }

    async updateTask(data: TaskData): Promise<TaskData>  {
        return await this.repository.update(data)
    }
}