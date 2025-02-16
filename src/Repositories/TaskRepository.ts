import {ORM, TaskData} from "../Data/Types"
import {ITaskRepository} from "./ITaskRepository"

export class TaskRepository implements ITaskRepository {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async create(data: TaskData): Promise<TaskData> {
        return this.orm.task.create({
            data: data
        })
    }

    async update(data: TaskData): Promise<TaskData> {
        return this.orm.task.update({
            where: {
                id: data.id
            },
            data: data
        })
    }
}