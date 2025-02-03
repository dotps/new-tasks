import {UserService} from "../Services/UserService"
import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {ORM} from "../Data/Types"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {User} from "../Models/User"
import {AuthData} from "../Data/AuthData"
import {ResponseSuccess} from "../ResponseSuccess"

export class UserController implements IUserController {

    private userService: UserService

    constructor(orm: ORM) {
        this.userService = new UserService(orm)
    }

    async createUser(req: Request, res: Response): Promise<void> {

        const user = new User(req.body)
        if (!user.isValidData()) {
            return ResponseError.send(res, "Пользователь не создан. Входные данные не валидны.", ResponseCode.ERROR_BAD_REQUEST)
        }

        try {
            const createdUser = await this.userService.createUser(user.data)
            if (!createdUser.data.id) {
                return ResponseError.send(res, "Пользователь не создан.", ResponseCode.SERVER_ERROR)
            }

            const response = new AuthData(createdUser)
            ResponseSuccess.send(res, response, ResponseCode.SUCCESS_CREATED)
        }
        catch (errorContext) {
            return ResponseError.send(res, "Ошибка при создании пользователя.", ResponseCode.SERVER_ERROR, errorContext)
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        console.log("getUsers")
    }

}