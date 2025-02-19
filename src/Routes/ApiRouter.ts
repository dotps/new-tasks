import {NextFunction, Request, Response, Router} from "express"
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

        this.initUserRoutes()
        this.initProjectRoutes()
        this.initTaskRoutes()
    }

    public getRouter(): Router {
        return this.router
    }

    private initUserRoutes(): void {
        this.router.get(
            "/users",
            this.userController.getUsers.bind(this.userController)
        )
        this.router.post(
            "/users",
            this.userController.createUser.bind(this.userController)
        )
    }

    private initProjectRoutes(): void {
        this.router.use("/projects", this.authMiddleware.handle.bind(this.authMiddleware))
        this.router.get(
            "/projects",
            this.projectController.getAll.bind(this.projectController)
        )
        this.router.post(
            "/projects",
            this.projectController.createProject.bind(this.projectController)
        )
    }

    private initTaskRoutes(): void {
        this.router.use("/tasks", this.authMiddleware.handle.bind(this.authMiddleware))
        this.router.post(
            "/tasks",
            this.taskController.createTask.bind(this.taskController)
        )
        this.router.put(
            "/tasks/:taskId",
            this.taskController.updateTask.bind(this.taskController)
        )
        this.router.patch(
            "/tasks/:taskId/assigned-user",
            this.taskController.assignSelf.bind(this.taskController)
        )
        this.router.patch(
            "/tasks/:taskId/status",
            this.taskController.updateStatus.bind(this.taskController)
        )
    }

    public handleRoute(req: Request, res: Response): void {
        return ResponseError.sendError(res, "Маршрут не найден", ResponseCode.ERROR_NOT_FOUND)
    }

}
