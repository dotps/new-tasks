import {Request, Response} from "express"
import {IUserController} from "./user.controller.interface"
import {IUserService} from "../services/user.service.interface"
import {ITokenService} from "../services/token.service.interface"
import {UserData} from "../data/types"
import {AuthDataGenerator} from "../data/auth-data-generator"
import {ResponseSuccess} from "../responses/response-success"
import {ResponseError} from "../responses/response-error"
import {ResponseCode} from "../responses/response-code"
import {QueryHelper} from "../helpers/query-helper"

export class UserController implements IUserController {

    private readonly userService: IUserService
    private readonly tokenService: ITokenService

    constructor(userService: IUserService, tokenService: ITokenService) {
        this.tokenService = tokenService
        this.userService = userService
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body as Partial<UserData>
            const normalizedUserData: Partial<UserData> = this.userService.toCreateData(userData)
            const createdUserData: UserData = await this.userService.create(normalizedUserData)
            const authData = new AuthDataGenerator(createdUserData, this.tokenService)

            ResponseSuccess.send(res, authData.toData(), ResponseCode.SuccessCreated)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getWorkingTime(req: Request, res: Response): Promise<void> {
        try {
            const {userId, projectIds, startDate, endDate} = QueryHelper.parseWorkingTimeParams(req)
            const result = await this.userService.getWorkingTime(userId, projectIds, startDate, endDate)

            ResponseSuccess.send(res, result, ResponseCode.Success)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }
}