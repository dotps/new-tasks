import {NextFunction, Request, Response} from "express"
import {ResponseError} from "../ResponseError"
import {ResponseCode} from "../ResponseCode"
import {User} from "../Models/User"
import {UserData} from "../Data/Types"
import {IUserService} from "../Services/IUserService"
import {CurrentUser} from "../CurrentUser"

export class AuthMiddleware {
    private userService: IUserService
    private currentUser: CurrentUser

    constructor(userService: IUserService, currentUser: CurrentUser) {
        this.currentUser = currentUser
        this.userService = userService
    }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return ResponseError.sendError(res, "Токен авторизации отклонен.", ResponseCode.ERROR_UNAUTHORIZED)
        }

        const [bearer, token] = authHeader.split(" ")
        if (bearer !== 'Bearer' || !token) {
            return ResponseError.sendError(res, "Неверный формат токена.", ResponseCode.ERROR_UNAUTHORIZED)
        }

        const userId = AuthMiddleware.decodeToken(token)
        if (!userId) {
            return ResponseError.sendError(res, "Неверный токен.", ResponseCode.ERROR_UNAUTHORIZED);
        }

        const userData: Partial<UserData> | null = await this.userService.getById(userId)
        if (!userData) {
            return ResponseError.sendError(res, "Авторизация не возможна. Пользователь не найден.", ResponseCode.ERROR_UNAUTHORIZED)
        }

        this.currentUser.set(new User(userData))

        next()
    }

    private static decodeToken(token: string): number | undefined {
        return Number(token) || undefined
    }
}