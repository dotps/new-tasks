import {UserService} from "../Models/UserService"
import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {AuthData, ORM, UserData} from "../Models/Types"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"

export class UserController implements IUserController {

    private userService: UserService

    constructor(orm: ORM) {
        this.userService = new UserService(orm)
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const { name, email } = req.body

        // TODO: валидация входящих данных

        try {
            const user: UserData = await this.userService.createUser(name, email)

            if (!user?.id) {
                const error = new ResponseError("Пользователь не создан.", ResponseCode.SERVER_ERROR)
                res.status(error.getStatusCode()).json(error)
                return
            }

            const response: AuthData = {
                id: user.id,
                token: Token.generate(user.id)
            }

            res.status(ResponseCode.SUCCESS_CREATED).json(response)
        }
        catch (errorContext) {
            const error = new ResponseError("Ошибка при создании пользователя.", ResponseCode.SERVER_ERROR, errorContext)
            res.status(error.getStatusCode()).json(error)
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        console.log("getUsers")
    }
}