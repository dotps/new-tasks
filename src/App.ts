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
import {CurrentUser} from "./Data/Models/CurrentUser"
import {ITaskDAO} from "./Data/DAO/ITaskDAO"
import {TaskDAO} from "./Data/DAO/TaskDAO"
import {IUserDAO} from "./Data/DAO/IUserDAO"
import {UserDAO} from "./Data/DAO/UserDAO"
import {IProjectDAO} from "./Data/DAO/IProjectDAO"
import {ProjectDAO} from "./Data/DAO/ProjectDAO"
import {ConsoleLogger} from "./Services/Logger/ConsoleLogger"
import {Logger} from "./Services/Logger/Logger"
import {ITokenService} from "./Services/ITokenService"
import {SimpleTokenService} from "./Services/SimpleTokenService"

export class App {
    private app: Application
    private apiRouter: IRouter

    constructor() {
        this.app = express()
        this.app.use(express.json())

        // "accessToken": "YWNjZXNzLXRva2VuITkhMTc0MDQwMDY2Nzc0NA==",
        // "refreshToken": "cmVmcmVzaC10b2tlbiE5ITE3NDA0ODM0Njc3NDQ="

        Logger.init(new ConsoleLogger(true))

        const orm:ORM = new PrismaClient()

        const userDAO: IUserDAO = new UserDAO(orm.user)
        const projectDAO: IProjectDAO = new ProjectDAO(orm.project)
        const taskDAO: ITaskDAO = new TaskDAO(orm.task)

        const tokenService: ITokenService = new SimpleTokenService()

        const userService = new UserService(userDAO)
        const projectService = new ProjectService(projectDAO)
        const taskService = new TaskService(taskDAO)

        const currentUser = new CurrentUser()

        const authMiddleware = new AuthMiddleware(userService, currentUser, tokenService)
        const requestBodyMiddleware = new RequestBodyMiddleware()
        this.app.use(requestBodyMiddleware.handleJson)

        const userController = new UserController(userService, taskService, currentUser, tokenService)
        const projectController = new ProjectController(projectService, taskService, currentUser)
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

