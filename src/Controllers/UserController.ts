import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {UserData} from "../Data/Types"
import {User} from "../Models/User"
import {IUserService} from "../Services/IUserService"
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {UserValidator} from "../Validation/UserValidator"

export class UserController implements IUserController {

    private readonly userService: IUserService

    constructor(userService: IUserService) {
        this.userService = userService
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const user = new User(req.body)

        try {
            const validator = new UserValidator(user)
            if (!validator.isValidCreateData()) return
            const userData: UserData = await this.userService.create(user.toCreateData() as UserData)
            const createdUser = new User(userData)
            ResponseSuccess.send(res, createdUser.toAuthData(), ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        console.log("getUsers")
    }

}