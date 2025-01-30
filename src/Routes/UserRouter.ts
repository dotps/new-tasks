import { Router, Request, Response } from "express"
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
    }

    private getUsers(req: Request, res: Response): void {
        console.log("getUsers")
        res.send()
    }
}
