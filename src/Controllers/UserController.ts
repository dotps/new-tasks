import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {UserData} from "../Data/Types"
import {User} from "../Models/User"
import {IUserService} from "../Services/IUserService"
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {UserValidator} from "../Validation/UserValidator"
import {CurrentUser} from "../CurrentUser"

export class UserController implements IUserController {

    private readonly userService: IUserService
    private readonly currentUser: CurrentUser

    constructor(userService: IUserService, currentUser: CurrentUser) {
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
}