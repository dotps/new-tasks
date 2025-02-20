import express, {Application} from "express"
import {ApiRouter} from "./Routes/ApiRouter"
import {IRouter} from "./Routes/IRouter"
import {PrismaClient} from "@prisma/client"
import {ORM} from "./Data/Types"
import {RequestBodyMiddleware} from "./Middlewares/RequestBodyMiddleware"
import {UserService} from "./Services/UserService"
import {UserController} from "./Controllers/UserController"
import {TaskController} from "./Controllers/TaskController"
import {AuthMiddleware} from "./Middlewares/AuthMiddleware"
import {TaskService} from "./Services/TaskService"
import {ProjectService} from "./Services/ProjectService"
import {ProjectController} from "./Controllers/ProjectController"
import {CurrentUser} from "./CurrentUser"

export class App {
    private app: Application
    private apiRouter: IRouter

    constructor() {
        this.app = express()
        this.app.use(express.json())

        const orm:ORM = new PrismaClient()

        const userService = new UserService(orm)
        const projectService = new ProjectService(orm)
        const taskService = new TaskService(orm)

        const currentUser = new CurrentUser()
        const authMiddleware = new AuthMiddleware(userService, currentUser)
        const requestBodyMiddleware = new RequestBodyMiddleware()
        this.app.use(requestBodyMiddleware.handleJson)

        const userController = new UserController(userService, taskService, currentUser)
        const projectController = new ProjectController(projectService, currentUser)
        const taskController = new TaskController(taskService, currentUser)

        this.apiRouter = new ApiRouter(userController, taskController, projectController, authMiddleware)
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

