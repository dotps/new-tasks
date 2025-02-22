import {CompletedTasksFilter, TaskData, TaskModelDelegate} from "../Data/Types"
import {OrmError} from "../Errors/OrmError"
import {Prisma} from "@prisma/client"
import {ITaskDAO} from "./ITaskDAO"
import {CrudDAO} from "./CrudDAO"

export class TaskDAO extends CrudDAO<TaskData, TaskModelDelegate> implements ITaskDAO {
    constructor(model: TaskModelDelegate) {
        super(model)
    }

    async getCompletedTasks(filter: CompletedTasksFilter): Promise<Partial<TaskData>[]> {
        try {
            const projectsFilter = filter?.projectsIds?.length === 0 ? undefined : filter.projectsIds
            const selectUser = !filter?.includeUser ? undefined : includeUser
            return await this.model.findMany({
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
}

const includeUser: Prisma.TaskInclude = {
    assignedTo: {
        select: {
            id: true,
            name: true,
        }
    }
}