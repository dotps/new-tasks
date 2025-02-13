import {NextFunction, Request, Response, Router} from "express"
import {IRouter} from "./IRouter"
import {UserController} from "../Controllers/UserController"
import {ORM} from "../Data/Types"
import {TaskController} from "../Controllers/TaskController"
import {IUserController} from "../Controllers/IUserController"
import {ITaskController} from "../Controllers/ITaskController"
import {AuthMiddleware} from "../Middlewares/AuthMiddleware"
import {ResponseError} from "../ResponseError"
import {ResponseCode} from "../ResponseCode"

export class ApiRouter implements IRouter {
    private readonly router: Router
    private readonly userController: IUserController
    private readonly taskController: ITaskController
    private readonly authMiddleware: AuthMiddleware

    constructor(orm: ORM) {
        this.router = Router()
        this.userController = new UserController(orm)
        this.taskController = new TaskController(orm)
        this.authMiddleware = new AuthMiddleware()

        this.initRoutes()
    }

    public getRouter(): Router {
        return this.router
    }

    private initRoutes(): void {
        this.router.get('/users', this.userController.getUsers.bind(this.userController))
        this.router.post('/users', this.userController.createUser.bind(this.userController))

        this.router.post('/projects', this.authMiddleware.handle, this.taskController.createProject.bind(this.taskController))

        this.router.post('/tasks', this.authMiddleware.handle, this.taskController.createTask.bind(this.taskController))
        this.router.put('/tasks/:id', this.authMiddleware.handle, this.taskController.updateTask.bind(this.taskController))
    }

    public handleRoute(req: Request, res: Response): void {
        return ResponseError.send(res, "Маршрут не найден", ResponseCode.ERROR_NOT_FOUND)
    }
}
