import express, {Application} from "express"
import {UserRouter} from "./Routes/UserRouter"
import {IRouter} from "./Routes/IRouter"
import {PrismaClient} from "@prisma/client"
import {ORM} from "./Data/Types"

export class App {
    private app: Application
    private userRouter: IRouter

    constructor() {
        this.app = express()
        this.app.use(express.json())
        const orm:ORM = new PrismaClient()
        this.userRouter = new UserRouter(orm)
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

