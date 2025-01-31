import {Router, Request, Response} from "express"
import {IRouter} from "./IRouter"

export class UserRouter implements IRouter {
    private readonly router: Router

    constructor() {
        this.router = Router()
        this.initRoutes()
    }

    public getRouter(): Router {
        return this.router
    }

    private initRoutes(): void {
        this.router.get('/', this.getUsers)
        this.router.post('/', this.createUser)
    }

    private getUsers(req: Request, res: Response): void {
        res.send("getUsers")
    }

    private createUser(req: Request, res: Response): void {
        const data = req.body
        res.send(data)
    }
}
