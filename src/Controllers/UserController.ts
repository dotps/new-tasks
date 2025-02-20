import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {TaskData, UserData, ValidationType} from "../Data/Types"
import {User} from "../Models/User"
import {IUserService} from "../Services/IUserService"
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {UserValidator} from "../Validation/UserValidator"
import {CurrentUser} from "../CurrentUser"
import {ITaskService} from "../Services/ITaskService"
import {TaskUtils} from "../Utils/TaskUtils"

export class UserController implements IUserController {

    private readonly userService: IUserService
    private taskService: ITaskService
    private readonly currentUser: CurrentUser

    constructor(userService: IUserService, taskService: ITaskService, currentUser: CurrentUser) {
        this.taskService = taskService
        this.currentUser = currentUser
        this.userService = userService
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const normalizedData: Partial<UserData> = new User(req.body).toCreateData()
            const validator = new UserValidator(normalizedData)
            validator.validateCreateDataOrThrow()

            const userData: UserData = await this.userService.create(normalizedData)
            const createdUser = new User(userData)
            ResponseSuccess.send(res, createdUser.toAuthData(), ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getWorkingTime(req: Request, res: Response): Promise<void> {
        try {

            // ?projects=1,2&start_date=&end_date=

            const userData: Partial<UserData> = {
                id: Number(req.params.userId) || undefined,
            }

            const validator = new UserValidator(userData)
            if (!validator.validateExistId()) validator.throwValidationError(ValidationType.NOT_FOUND)

            // Любой пользователь может запросить время работы одного разработчика и отфильтровать по проектам и временным интервалам.
            // Например:
            // все проекты за месяц
            // один проект за последнюю неделю

            const tasks: Partial<TaskData>[] = await this.taskService.getCompletedTasks(userData.id!)
            const seconds = TaskUtils.calculateWorkingTime(tasks)

            ResponseSuccess.send(res, {seconds: seconds}, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }
}