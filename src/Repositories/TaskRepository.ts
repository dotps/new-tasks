import {ORM, TaskData} from "../Data/Types"
import {IRepository} from "./IRepository"

export class TaskRepository implements IRepository {
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