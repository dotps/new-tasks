import {Request, Response, Router} from "express"
import {ITaskController} from "../controllers/task.controller.interface"
import {IRouter} from "./router.interface"
import {AuthMiddleware} from "../middlewares/auth.middleware"
import {ResponseError} from "../responses/response-error"
import {ResponseCode} from "../responses/response-code"

export class TaskRouter implements IRouter {
    private readonly router: Router
    private readonly taskController: ITaskController
    private readonly authMiddleware: AuthMiddleware

    constructor(taskController: ITaskController, authMiddleware: AuthMiddleware) {
        this.taskController = taskController
        this.authMiddleware = authMiddleware
        this.router = Router()
    }

    public getRouter(): Router {
        return this.router
    }

    public init(): void {
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