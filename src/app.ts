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
    private apiRouter: IRouter

    constructor() {
        this.app = express()
        this.app.use(express.json())

        Logger.init(new ConsoleLogger(true))

        const orm: ORM = new PrismaClient()

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

        const userRouter = new UserRouter(userController, authMiddleware)
        const projectRouter = new ProjectRouter(projectController, authMiddleware)
        const taskRouter = new TaskRouter(taskController, authMiddleware)
        const tokenRouter = new TokenRouter(authMiddleware)

        this.apiRouter = new ApiRouter(userRouter, projectRouter, taskRouter, tokenRouter)
        this.initRoutes()
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Сервер запущен, порт: ${port}`)
        })
    }

    private initRoutes(): void {
        this.app.use("/api", this.apiRouter.getRouter())
        this.app.use(this.apiRouter.handleRoute)
    }
}

