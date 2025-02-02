import {User} from "../Models/User"
import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {AuthData, ORM, UserData} from "../Models/Types"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"

export class UserController implements IUserController {

    private user: User

    constructor(orm: ORM) {
        this.user = new User(orm)
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const { name, email } = req.body

        try {
            const user: UserData = await this.user.createUser(name, email)

            if (!user?.id) {
                const error = new ResponseError("Пользователь не создан.", ResponseCode.SERVER_ERROR)
                res.status(error.getStatusCode()).json(error)
                return
            }

            const response: AuthData = {
                id: user.id,
                token: user.id.toString()
            }

            res.status(ResponseCode.SUCCESS_CREATED).json(response)
        }
        catch (errorContext) {
            const error = new ResponseError(this.constructor.name, ResponseCode.SERVER_ERROR, errorContext)
            res.status(error.getStatusCode()).json(error)
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        console.log("getUsers")
    }
}