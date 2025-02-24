import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {CompletedTasksFilter, UserData, ValidationType} from "../Data/Types"
import {User} from "../Data/Models/User"
import {IUserService} from "../Services/IUserService"
import {ResponseSuccess} from "../Responses/ResponseSuccess"
import {ResponseCode} from "../Responses/ResponseCode"
import {ResponseError} from "../Responses/ResponseError"
import {UserValidator} from "../Services/Validation/UserValidator"
import {CurrentUser} from "../Data/Models/CurrentUser"
import {ITaskService} from "../Services/ITaskService"
import {QueryHelper} from "../Helpers/QueryHelper"
import {ITokenService} from "../Services/ITokenService"
import {AuthDataGenerator} from "../Data/AuthDataGenerator"

export class UserController implements IUserController {

    private readonly userService: IUserService
    private readonly tokenService: ITokenService
    private readonly taskService: ITaskService
    private readonly currentUser: CurrentUser

    constructor(userService: IUserService, taskService: ITaskService, currentUser: CurrentUser, tokenService: ITokenService) {
        this.tokenService = tokenService
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
            const authData = new AuthDataGenerator(userData, this.tokenService)
            ResponseSuccess.send(res, authData.toData(), ResponseCode.SUCCESS_CREATED)
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

            const result = await this.taskService.getWorkingTime(filter)
            ResponseSuccess.send(res, result, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }
}