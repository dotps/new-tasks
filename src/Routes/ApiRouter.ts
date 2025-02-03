import {Router} from "express"
import {IRouter} from "./IRouter"
import {UserController} from "../Controllers/UserController"
import {ORM} from "../Data/Types"
import {TaskController} from "../Controllers/TaskController"
import {IUserController} from "../Controllers/IUserController"
import {ITaskController} from "../Controllers/ITaskController"

export class ApiRouter implements IRouter {
    private readonly router: Router
    private readonly userController: IUserController
    private readonly taskController: ITaskController

    constructor(orm: ORM) {
        this.router = Router()
        this.userController = new UserController(orm)
        this.taskController = new TaskController(orm)

        this.initRoutes()
    }

    public getRouter(): Router {
        return this.router
    }

    private initRoutes(): void {
        this.router.get('/users', this.userController.getUsers.bind(this.userController))
        this.router.post('/users', this.userController.createUser.bind(this.userController))

        this.router.post('/projects', this.taskController.createProject.bind(this.taskController))
        this.router.post('/tasks', this.taskController.createTask.bind(this.taskController))
    }
}
