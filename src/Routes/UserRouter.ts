import {Router} from "express"
import {IRouter} from "./IRouter"
import {UserController} from "../Controllers/UserController"
import {ORM} from "../Models/Types"

export class UserRouter implements IRouter {
    private readonly router: Router
    private readonly userController: UserController

    constructor(orm: ORM) {
        this.router = Router()
        this.userController = new UserController(orm)

        this.initRoutes()
    }

    public getRouter(): Router {
        return this.router
    }

    private initRoutes(): void {
        this.router.get('/', this.userController.getUsers)
        this.router.post('/', this.userController.createUser)
    }
}
