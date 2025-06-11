import {Request, Response, Router} from "express"
import {IRouter} from "./router.interface"
import {AuthMiddleware} from "../middlewares/auth.middleware"
import {ResponseError} from "../responses/response-error"
import {ResponseCode} from "../responses/response-code"

export class TokenRouter implements IRouter {
    private readonly router: Router
    private readonly authMiddleware: AuthMiddleware

    constructor(authMiddleware: AuthMiddleware) {
        this.authMiddleware = authMiddleware
        this.router = Router()
    }

    public getRouter(): Router {
        return this.router
    }

    public init(): void {
        this.router.post(
            "/tokens/refresh",
            this.authMiddleware.refreshAccessToken.bind(this.authMiddleware)
        )
    }

    public handleRoute(req: Request, res: Response): void {
        return ResponseError.sendError(res, "Маршрут не найден", ResponseCode.ErrorNotFound)
    }
} 