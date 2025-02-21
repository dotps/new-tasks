import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {CompletedTasksFilter, TaskData, UserData, ValidationType, WorkingTimeData} from "../Data/Types"
import {User} from "../Models/User"
import {IUserService} from "../Services/IUserService"
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {UserValidator} from "../Validation/UserValidator"
import {CurrentUser} from "../CurrentUser"
import {ITaskService} from "../Services/ITaskService"
import {TaskHelper} from "../Utils/TaskHelper"
import {QueryHelper} from "../Utils/QueryHelper"

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
            const userData: Partial<UserData> = {
                id: Number(req.params.userId) || undefined,
            }

            const validator = new UserValidator(userData)
            if (!validator.validateExistId()) validator.throwValidationError(ValidationType.NOT_FOUND)

            const filter: CompletedTasksFilter = {
                userId: userData.id,
                projectsIds: QueryHelper.parseNumberList(req.query?.projects?.toString()),
                startDate: QueryHelper.parseDate(req.query?.start_date?.toString()),
                endDate: QueryHelper.parseDate(req.query?.end_date?.toString())
            }

            // TODO: /api/users/10000/working-time?projects=&start_date=&end_date=
            // TODO: выдает 0 секунд, а по идее нужно ошибку, что пользователь с id 10000 не найден

            const result = await this.taskService.getWorkingTime(filter)
            ResponseSuccess.send(res, result, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }
}