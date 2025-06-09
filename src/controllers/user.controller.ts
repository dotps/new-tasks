import {Request, Response} from "express"
import {ITaskService} from "../services/task.service.interface"
import {IUserController} from "./user.controller.interface"
import {IUserService} from "../services/user.service.interface"
import {ITokenService} from "../services/token.service.interface"
import {CurrentUser} from "../data/models/current-user"
import {UserValidator} from "../services/validation/user.validator"
import {CompletedTasksFilter, UserData, ValidationType} from "../data/types"
import {AuthDataGenerator} from "../data/auth-data-generator"
import {ResponseSuccess} from "../responses/response-success"
import {ResponseError} from "../responses/response-error"
import {QueryHelper} from "../helpers/query-helper"
import {ResponseCode} from "../responses/response-code"
import {User} from "../data/models/user"

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
            ResponseSuccess.send(res, authData.toData(), ResponseCode.SuccessCreated)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getWorkingTime(req: Request, res: Response): Promise<void> {
        try {
            const userData: Partial<UserData> = {
                id: Number(req.params.userId) || undefined,
            }

            const validator = new UserValidator(userData)
            if (!validator.validateExistId()) validator.throwValidationError(ValidationType.NotFound)

            const filter: CompletedTasksFilter = {
                userId: userData.id,
                projectsIds: QueryHelper.parseNumberList(req.query?.projects?.toString()),
                startDate: QueryHelper.parseDate(req.query?.start_date?.toString()),
                endDate: QueryHelper.parseDate(req.query?.end_date?.toString())
            }

            const result = await this.taskService.getWorkingTime(filter)
            ResponseSuccess.send(res, result, ResponseCode.Success)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }
}