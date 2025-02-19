import {PrismaClient, User as UserData, Project as ProjectData, Task as TaskData, TaskStatus as TaskStatusData} from "@prisma/client"

export type EntityData = UserData | ProjectData | TaskData

export type {
    UserData,
    ProjectData,
    TaskData,
    // TaskStatus
}

export const TaskStatus = TaskStatusData

export type ProjectWithTasks = Partial<ProjectData> & { tasks: Partial<TaskData>[] }

// export function toTaskStatus(status: string | undefined): TaskStatus | undefined {
//     if (Object.values(TaskStatus).includes(status as TaskStatus)) {
//         return status as TaskStatus
//     }
//     return undefined
// }

export function toTaskStatus(status: string | undefined): TaskStatusData | undefined {
    if (Object.values(TaskStatusData).includes(status as TaskStatusData)) {
        return status as TaskStatusData
    }
    return undefined
    // return TaskStatusData.CREATED
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
