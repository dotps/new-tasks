import {User} from "../Models/User"
import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {ORM, UserData} from "../Models/Types"

export class UserController implements IUserController {

    private user: User
    constructor(orm: ORM) {
        this.user = new User(orm)
    }
    async createUser(req: Request, res: Response): Promise<void> {
        const { name, email } = req.body
        console.log(name, email)

        const user: UserData = await this.user.createUser(name, email)
        res.json(user)
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        console.log("getUsers")
    }
}