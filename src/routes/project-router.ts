import {Request, Response, Router} from "express"
import {IProjectController} from "../controllers/project.controller.interface"
import {IRouter} from "./router.interface"
import {AuthMiddleware} from "../middlewares/auth.middleware"
import {ResponseError} from "../responses/response-error"
import {ResponseCode} from "../responses/response-code"

export class ProjectRouter implements IRouter {
    private readonly router: Router
    private readonly projectController: IProjectController
    private readonly authMiddleware: AuthMiddleware

    constructor(projectController: IProjectController, authMiddleware: AuthMiddleware) {
        this.projectController = projectController
        this.authMiddleware = authMiddleware
        this.router = Router()
    }

    public getRouter(): Router {
        return this.router
    }

    public init(): void {
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

    public handleRoute(req: Request, res: Response): void {
        return ResponseError.sendError(res, "Маршрут не найден", ResponseCode.ErrorNotFound)
    }
} 