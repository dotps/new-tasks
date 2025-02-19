import {ORM, TaskData, UserData} from "../Data/Types"
import {ITaskService} from "./ITaskService"
import {OrmError} from "../OrmError"

export class TaskService implements ITaskService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async create(data: Partial<TaskData>): Promise<TaskData> {
        try {
            return await this.orm.task.create({
                data: data as TaskData
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }

    async update(data: Partial<TaskData>): Promise<TaskData> {
        try {
            return await this.orm.task.update({
                where: {
                    id: data.id
                },
                data: data as TaskData
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }

    async getById(id: number): Promise<TaskData | null> {
        try {
            return await this.orm.task.findUnique({
                where: {
                    id: id
                }
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }
}