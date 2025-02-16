import {Request, Response, Router} from "express"
import {IRouter} from "./IRouter"
import {IUserController} from "../Controllers/IUserController"
import {ITaskController} from "../Controllers/ITaskController"
import {AuthMiddleware} from "../Middlewares/AuthMiddleware"
import {ResponseError} from "../ResponseError"
import {ResponseCode} from "../ResponseCode"
import {IProjectController} from "../Controllers/IProjectController"

export class ApiRouter implements IRouter {
    private readonly router: Router
    private readonly projectController: IProjectController
    private readonly userController: IUserController
    private readonly taskController: ITaskController
    private readonly authMiddleware: AuthMiddleware

    constructor(userController: IUserController, taskController: ITaskController, projectController: IProjectController, authMiddleware: AuthMiddleware) {
        this.projectController = projectController
        this.userController = userController
        this.taskController = taskController
        this.authMiddleware = authMiddleware

        this.router = Router()
        this.initRoutes()
    }

    public getRouter(): Router {
        return this.router
    }

    private initRoutes(): void {
        this.router.get('/users', this.userController.getUsers.bind(this.userController))
        this.router.post('/users', this.userController.createUser.bind(this.userController))

        this.router.post('/projects', this.authMiddleware.handle, this.projectController.createProject.bind(this.projectController))

        this.router.post('/tasks', this.authMiddleware.handle, this.taskController.createTask.bind(this.taskController))
        this.router.put('/tasks/:id', this.authMiddleware.handle, this.taskController.updateTask.bind(this.taskController))
    }

    public handleRoute(req: Request, res: Response): void {
        return ResponseError.sendError(res, "Маршрут не найден", ResponseCode.ERROR_NOT_FOUND)
    }

}
