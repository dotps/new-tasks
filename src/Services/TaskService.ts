import {CompletedTasksFilter, ORM, TaskData, WorkingTimeData} from "../Data/Types"
import {ITaskService} from "./ITaskService"
import {OrmError} from "../OrmError"
import {Prisma} from "@prisma/client"
import {TaskHelper} from "../Utils/TaskHelper"
import {ValidationError} from "../ValidationError"

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

    async getCompletedTasks(filter: CompletedTasksFilter): Promise<Partial<TaskData>[]> {
        try {
            const projectsFilter = filter?.projectsIds?.length === 0 ? undefined : filter.projectsIds
            const selectUser = !filter?.includeUser ? undefined : includeUser
            return await this.orm.task.findMany({
                where: {
                    assignedToUserId: filter.userId,
                    completedAt: {
                        not: null,
                        gte: filter.startDate,
                        lte: filter.endDate,
                    },
                    projectId: {
                        in: projectsFilter
                    },
                },
                select: {
                    id: true,
                    projectId: true,
                    createdAt: true,
                    completedAt: true,
                    assignedToUserId: true,
                    ...selectUser
                }
                // TODO: тут надо еще одно поле когда задача была взята в работу, createdAt не подходит
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }

    async getWorkingTime(filter: CompletedTasksFilter): Promise<WorkingTimeData> {
        const tasks: Partial<TaskData>[] = await this.getCompletedTasks(filter)
        if (tasks.length === 0) throw ValidationError.EntityNotFound()
        const seconds = TaskHelper.calculateWorkingTime(tasks)
        return {
            totalSeconds: seconds
        }
    }
}

const includeUser: Prisma.TaskInclude = {
    assignedTo: {
        select: {
            id: true,
            name: true,
        }
    }
}