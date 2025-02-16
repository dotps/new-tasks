import express, {Application, NextFunction, Request, Response} from "express"
import {ApiRouter} from "./Routes/ApiRouter"
import {IRouter} from "./Routes/IRouter"
import {PrismaClient} from "@prisma/client"
import {ORM} from "./Data/Types"
import {ResponseError} from "./ResponseError"
import {ResponseCode} from "./ResponseCode"
import {RequestBodyMiddleware} from "./Middlewares/RequestBodyMiddleware"
import {UserRepository} from "./UserRepository"
import {UserService} from "./Services/UserService"
import {UserController} from "./Controllers/UserController"
import {TaskController} from "./Controllers/TaskController"
import {AuthMiddleware} from "./Middlewares/AuthMiddleware"

export class App {
    private app: Application
    private apiRouter: IRouter

    constructor() {
        this.app = express()
        this.app.use(express.json())

        const authMiddleware = new AuthMiddleware()
        const requestBodyMiddleware = new RequestBodyMiddleware()
        this.app.use(requestBodyMiddleware.handleJson)

        const orm:ORM = new PrismaClient()

        const userRepository = new UserRepository(orm)
        const userService = new UserService(userRepository)
        const userController = new UserController(userService)

        const taskRepository = new TaskRepository(orm)
        const taskService = new TaskService(taskRepository)
        const taskController = new TaskController(taskService)

        this.apiRouter = new ApiRouter(userController, taskController, authMiddleware)
        this.initRoutes()
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Сервер запущен, порт: ${port}`)
        })
    }

    private initRoutes(): void {
        this.app.use('/api', this.apiRouter.getRouter())
        this.app.use(this.apiRouter.handleRoute)
    }
}

