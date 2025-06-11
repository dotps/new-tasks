import {Request, Response, Router} from "express"
import {IUserController} from "../controllers/user.controller.interface"
import {IRouter} from "./router.interface"
import {AuthMiddleware} from "../middlewares/auth.middleware"
import {ResponseError} from "../responses/response-error"
import {ResponseCode} from "../responses/response-code"

export class UserRouter implements IRouter {
    private readonly router: Router
    private readonly userController: IUserController
    private readonly authMiddleware: AuthMiddleware

    constructor(userController: IUserController, authMiddleware: AuthMiddleware) {
        this.userController = userController
        this.authMiddleware = authMiddleware
        this.router = Router()
    }

    public getRouter(): Router {
        return this.router
    }

    public init(): void {
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

    public handleRoute(req: Request, res: Response): void {
        return ResponseError.sendError(res, "Маршрут не найден", ResponseCode.ErrorNotFound)
    }
} 