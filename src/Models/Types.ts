import {User as UserData} from "@prisma/client"
import {PrismaClient} from "@prisma/client"

export type {
    UserData
}

export type ORM = PrismaClient & {
    customMethod?: () => void
}
