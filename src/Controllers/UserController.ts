import {UserService} from "../Services/UserService"
import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {ORM, UserData} from "../Data/Types"
import {User} from "../Models/User"
import {IUserService} from "../Services/IUserService"
import {Entity} from "../Entity"
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {AuthData} from "../Data/AuthData"
import {ResponseError} from "../ResponseError"

export class UserController implements IUserController {

    private readonly userService: IUserService

    constructor(orm: ORM) {
        this.userService = new UserService(orm)
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const user = new User(req.body)
        try {
            const entityData: UserData = await Entity.create<User, UserData>(res, user, this.userService.createUser.bind(this.userService))
            const createdUser = new User(entityData)
            const authData = new AuthData(createdUser)
            ResponseSuccess.send(res, authData, ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        console.log("getUsers")
    }

}