import {PrismaClient, User as UserData} from "@prisma/client"

export type {
    UserData
}

export type ORM = PrismaClient & {
    customMethod?: () => void
}

