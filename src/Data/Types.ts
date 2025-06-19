import {PrismaClient, User as UserData, Project as ProjectData, Task as TaskData, Prisma} from "@prisma/client"
import {DefaultArgs} from "@prisma/client/runtime/client"
import {TaskStatus} from "@prisma/client"

export type EntityData = UserData | ProjectData | TaskData

export type {
    UserData,
    ProjectData,
    TaskData,
}

export type UserModelDelegate = Prisma.UserDelegate<DefaultArgs, Prisma.PrismaClientOptions>
export type TaskModelDelegate = Prisma.TaskDelegate<DefaultArgs, Prisma.PrismaClientOptions>
export type ProjectModelDelegate = Prisma.ProjectDelegate<DefaultArgs, Prisma.PrismaClientOptions>

export type ProjectWithTasks = Partial<ProjectData> & { tasks: Partial<TaskData>[] }

export function toTaskStatus(status: string | undefined): TaskStatus | undefined {
    if (Object.values(TaskStatus).includes(status as TaskStatus)) {
        return status as TaskStatus
    }
    return undefined
}

export type ORM = PrismaClient & {
    customMethod?: () => void,
}

export enum ValidationType {
    Create,
    Update,
    NotFound,
}

export type DataWithId = {
    id: number
}

export type CompletedTasksFilter = {
    userId?: number,
    projectsIds?: number[],
    startDate?: Date,
    endDate?: Date,
    includeUser?: boolean,
}

export type WorkingTimeData = {
    totalSeconds: number,
}

export type WorkingTimeParams = {
    userId?: number
    projectIds?: number[]
    startDate?: Date
    endDate?: Date
}