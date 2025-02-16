import {UserService} from "../Services/UserService"
import {Request, Response} from "express"
import {IUserController} from "./IUserController"
import {ORM, UserData} from "../Data/Types"
import {User} from "../Models/User"
import {IUserService} from "../Services/IUserService"
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {AuthData} from "../Data/AuthData"
import {ResponseError} from "../ResponseError"
import {CreateEntityCommand} from "../Commands/CreateEntityCommand"
import {UserRepository} from "../Repositories/UserRepository"

export class UserController implements IUserController {

    private readonly userService: IUserService

    constructor(userService: IUserService) {
        this.userService = userService
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const user = new User(req.body)

        try {
            const createCommand = new CreateEntityCommand<User, UserData>(user, this.userService.createUser.bind(this.userService))
            const userData: UserData = await createCommand.execute()
            const createdUser = new User(userData)
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