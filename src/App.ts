import express, {Application} from 'express'
import {UserRouter} from "./Routes/UserRouter"
import {IRouter} from "./Routes/IRouter"

export class App {
    private app: Application
    private userRouter: IRouter

    constructor() {
        this.app = express()
        this.app.use(express.json())
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

