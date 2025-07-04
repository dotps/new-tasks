import {Request, Response, Router} from "express"
import {IRouter} from "./router.interface"
import {ResponseError} from "../responses/response-error"
import {ResponseCode} from "../responses/response-code"

export class ApiRouter implements IRouter {
    private readonly router: Router
    private readonly routers: IRouter[]

    constructor(...routers: IRouter[]) {
        this.routers = routers
        this.router = Router()
        this.init()
    }

    public getRouter(): Router {
        return this.router
    }

    public init(): void {
        this.routers.forEach(router => {
            router.init()
            this.router.use(router.getRouter())
        })
    }

    public handleRoute(req: Request, res: Response): void {
        return ResponseError.sendError(res, "Маршрут не найден", ResponseCode.ErrorNotFound)
    }
}
