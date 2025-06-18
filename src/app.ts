import express, {Application} from "express"
import {ConsoleLogger} from "./services/logger/console-logger"
import {UserDAO} from "./data/dao/user.dao"
import {TaskService} from "./services/task.service"
import {IRouter} from "./routes/router.interface"
import {Logger} from "./services/logger/logger"
import {PrismaClient} from "@prisma/client"
import {ORM} from "./data/types"
import {IUserDAO} from "./data/dao/user.dao.interface"
import {IProjectDAO} from "./data/dao/project.dao.interface"
import {ProjectDAO} from "./data/dao/project.dao"
import {ITaskDAO} from "./data/dao/task.dao.interface"
import {TaskDAO} from "./data/dao/task.dao"
import {ITokenService} from "./services/token.service.interface"
import {SimpleTokenService} from "./services/simple-token.service"
import {UserService} from "./services/user.service"
import {ProjectService} from "./services/project.service"
import {CurrentUser} from "./data/models/current-user"
import {AuthMiddleware} from "./middlewares/auth.middleware"
import {RequestBodyMiddleware} from "./middlewares/request-body.middleware"
import {UserController} from "./controllers/user.controller"
import {ProjectController} from "./controllers/project.controller"
import {TaskController} from "./controllers/task.controller"
import {ApiRouter} from "./routes/api-router"
import {UserRouter} from "./routes/user-router"
import {ProjectRouter} from "./routes/project-router"
import {TaskRouter} from "./routes/task-router"
import {TokenRouter} from "./routes/token-router"

export class App {
    private app: Application
    private apiRouter!: IRouter
    private orm: ORM
    private userDAO!: IUserDAO
    private projectDAO!: IProjectDAO
    private taskDAO!: ITaskDAO
    private tokenService!: ITokenService
    private userService!: UserService
    private projectService!: ProjectService
    private taskService!: TaskService
    private currentUser: CurrentUser
    private authMiddleware!: AuthMiddleware
    private userController!: UserController
    private projectController!: ProjectController
    private taskController!: TaskController

    constructor() {
        this.app = express()
        this.app.use(express.json())

        Logger.init(new ConsoleLogger(true))

        this.orm = new PrismaClient()

        this.initDAO()
        this.initServices()

        this.currentUser = new CurrentUser()

        this.initMiddlewares()
        this.initControllers()
        this.initRouters()
        this.initRoutes()
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Сервер запущен, порт: ${port}`)
        })
    }

    private initDAO() {
        this.userDAO = new UserDAO(this.orm.user)
        this.projectDAO = new ProjectDAO(this.orm.project)
        this.taskDAO = new TaskDAO(this.orm.task)
    }

    private initServices() {
        this.tokenService = new SimpleTokenService()
        this.taskService = new TaskService(this.taskDAO)
        this.userService = new UserService(this.userDAO, this.taskService)
        this.projectService = new ProjectService(this.projectDAO, this.taskService)
    }

    private initMiddlewares() {
        this.authMiddleware = new AuthMiddleware(this.userService, this.currentUser, this.tokenService)
        const requestBodyMiddleware = new RequestBodyMiddleware()
        this.app.use(requestBodyMiddleware.handleJson)
    }

    private initControllers() {
        this.userController = new UserController(this.userService, this.tokenService)
        this.projectController = new ProjectController(this.projectService, this.currentUser)
        this.taskController = new TaskController(this.taskService, this.currentUser)
    }

    private initRouters() {
        const userRouter = new UserRouter(this.userController, this.authMiddleware)
        const projectRouter = new ProjectRouter(this.projectController, this.authMiddleware)
        const taskRouter = new TaskRouter(this.taskController, this.authMiddleware)
        const tokenRouter = new TokenRouter(this.authMiddleware)

        this.apiRouter = new ApiRouter(userRouter, projectRouter, taskRouter, tokenRouter)
    }

    private initRoutes(): void {
        this.app.use("/api", this.apiRouter.getRouter())
        this.app.use(this.apiRouter.handleRoute)
    }
}

