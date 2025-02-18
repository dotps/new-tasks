import {PrismaClient, User as UserData, Project as ProjectData, Task as TaskData, TaskStatus} from "@prisma/client"

export type EntityData = UserData | ProjectData | TaskData

export type {
    UserData,
    ProjectData,
    TaskData,
    TaskStatus
}

export type ProjectWithTasks = Partial<ProjectData> & { tasks: Partial<TaskData>[] }

export function toTaskStatus(status: string | undefined): TaskStatus | undefined {
    if (Object.values(TaskStatus).includes(status as TaskStatus)) {
        return status as TaskStatus
    }
    return undefined
}

export type ORM = PrismaClient & {
    customMethod?: () => void,
    // createEntity: <T, U>(data: T, model: { create: (args: { data: T }) => Promise<U> }, entityClass: new (data: U) => any) => Promise<any>
    // project: {
    //     create: (args: { data: ProjectData }) => Promise<ProjectData>;
    // },
    // task: {
    //     create: (args: { data: TaskData }) => Promise<TaskData>;
    // }
}
