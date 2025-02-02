import {User} from "../Models/User"
import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {AuthData, ORM, UserData} from "../Models/Types"
import {ResponseCode} from "../ResponseCode"

export class UserController implements IUserController {

    private user: User

    constructor(orm: ORM) {
        this.user = new User(orm)
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const { name, email } = req.body

        try {
            const user: UserData | null = await this.user.createUser(name, email)
            if (user && user.id) {
                const response: AuthData = {
                    id: user.id,
                    token: user.id.toString()
                }
                res.status(ResponseCode.SUCCESS_CREATED).json(response)
            } else {
                res.status(ResponseCode.ERROR_BAD_REQUEST).json({ error: "Пользователь не создан." })
            }
        }
        catch (e) {
            console.log(e)
            res.status(ResponseCode.SERVER_ERROR).json({ error: e })
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        console.log("getUsers")
    }
}