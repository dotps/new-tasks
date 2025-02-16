import {PrismaClient, User as UserData, Project as ProjectData, Task as TaskData} from "@prisma/client"

export type EntityData = UserData | ProjectData | TaskData
export type {
    UserData,
    ProjectData,
    TaskData
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

// TODO: изучить возможности реализации через интерфейс
// export interface TaskData extends Task {
//
// }

