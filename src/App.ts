import express, {Application} from "express"
import {UserRouter} from "./Routes/UserRouter"
import {IRouter} from "./Routes/IRouter"
import {IORM} from "./IORM"
import { PrismaClient } from "@prisma/client"

export class App {
    private app: Application
    private userRouter: IRouter
    private orm: IORM

        // TODO: внедрить prisma
    constructor() {
        this.app = express()
        this.app.use(express.json())
        this.orm = new PrismaClient()
        this.userRouter = new UserRouter()
        this.initRoutes()
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Сервер запущен, порт: ${port}`)
        })
    }

    private initRoutes(): void {
        this.app.use('/users', this.userRouter.getRouter())
    }
}

