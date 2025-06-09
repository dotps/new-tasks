import {Request, Response, Router} from "express"
import {IUserController} from "../controllers/user.controller.interface"
import {ITaskController} from "../controllers/task.controller.interface"
import {IRouter} from "./router.interface"
import {IProjectController} from "../controllers/project.controller.interface"
import {AuthMiddleware} from "../middlewares/auth.middleware"
import {ResponseError} from "../responses/response-error"
import {ResponseCode} from "../responses/response-code"

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

        this.initTokenRoutes()
        this.initUserRoutes()
        this.initProjectRoutes()
        this.initTaskRoutes()
    }

    public getRouter(): Router {
        return this.router
    }

    private initTokenRoutes(): void {
        this.router.post(
            "/tokens/refresh",
            this.authMiddleware.refreshAccessToken.bind(this.authMiddleware)
        )
    }

    private initUserRoutes(): void {
        this.router.post(
            "/users",
            this.userController.createUser.bind(this.userController)
        )
        this.router.use("/users", this.authMiddleware.handle.bind(this.authMiddleware))
        this.router.get(
            "/users/:userId/working-time",
            this.userController.getWorkingTime.bind(this.userController)
        )
    }

    private initProjectRoutes(): void {
        this.router.use("/projects", this.authMiddleware.handle.bind(this.authMiddleware))
        this.router.get(
            "/projects",
            this.projectController.getAll.bind(this.projectController)
        )
        this.router.get(
            "/projects/:projectId/working-time",
            this.projectController.getWorkingTime.bind(this.projectController)
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
            this.taskController.assignUser.bind(this.taskController)
        )
        this.router.patch(
            "/tasks/:taskId/status",
            this.taskController.updateStatus.bind(this.taskController)
        )
    }

    public handleRoute(req: Request, res: Response): void {
        return ResponseError.sendError(res, "Маршрут не найден", ResponseCode.ErrorNotFound)
    }

}
