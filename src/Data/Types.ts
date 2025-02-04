import {PrismaClient, User as UserData, Project as ProjectData} from "@prisma/client"

export type {
    UserData,
    ProjectData
}

export type ORM = PrismaClient & {
    customMethod?: () => void
}

