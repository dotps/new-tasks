import {PrismaClient, User as UserData, Project as ProjectData, Task as TaskData} from "@prisma/client"

export type {
    UserData,
    ProjectData,
    TaskData
}

export type ORM = PrismaClient & {
    customMethod?: () => void
}

