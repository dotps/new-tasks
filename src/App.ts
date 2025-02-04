import express, {Application, NextFunction, Request, Response} from "express"
import {ApiRouter} from "./Routes/ApiRouter"
import {IRouter} from "./Routes/IRouter"
import {PrismaClient} from "@prisma/client"
import {ORM} from "./Data/Types"
import {ResponseError} from "./ResponseError"
import {ResponseCode} from "./ResponseCode"

export class App {
    private app: Application
    private apiRouter: IRouter

    constructor() {
        this.app = express()
        this.app.use(express.json())
        const orm:ORM = new PrismaClient()
        this.apiRouter = new ApiRouter(orm)
        this.initRoutes()
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Сервер запущен, порт: ${port}`)
        })
    }

    private initRoutes(): void {
        this.app.use('/api', this.apiRouter.getRouter())

        this.app.use((req:  Request, res: Response) => {
            ResponseError.send(res, "Маршрут не найден", ResponseCode.ERROR_NOT_FOUND)
        })
    }
}

