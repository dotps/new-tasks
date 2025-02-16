import {ORM, TaskData} from "../Data/Types"
import {ITaskService} from "./ITaskService"
import {OrmError} from "../OrmError"

export class TaskService implements ITaskService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async create(data: TaskData): Promise<TaskData> {
        try {
            return this.orm.task.create({
                data: data
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }

    async update(data: TaskData): Promise<TaskData> {
        try {
            return this.orm.task.update({
                where: {
                    id: data.id
                },
                data: data
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }
}