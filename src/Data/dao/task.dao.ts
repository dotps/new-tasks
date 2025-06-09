import {OrmError} from "../../errors/orm-error"
import {CompletedTasksFilter, TaskData, TaskModelDelegate} from "../types"
import {CrudDAO} from "./crud.dao"
import {ITaskDAO} from "./task.dao.interface"
import {Prisma} from "@prisma/client"

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
            })
        } catch (error) {
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