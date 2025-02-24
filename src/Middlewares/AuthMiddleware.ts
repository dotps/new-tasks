import {NextFunction, Request, Response} from "express"
import {ResponseError} from "../Responses/ResponseError"
import {ResponseCode} from "../Responses/ResponseCode"
import {User} from "../Data/Models/User"
import {UserData} from "../Data/Types"
import {IUserService} from "../Services/IUserService"
import {CurrentUser} from "../Data/Models/CurrentUser"
import {ITokenService} from "../Services/ITokenService"
import {ResponseSuccess} from "../Responses/ResponseSuccess"

export class AuthMiddleware {
    private userService: IUserService
    private tokenService: ITokenService
    private currentUser: CurrentUser

    constructor(userService: IUserService, currentUser: CurrentUser, tokenService: ITokenService) {
        this.tokenService = tokenService
        this.currentUser = currentUser
        this.userService = userService
    }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return ResponseError.sendError(res, "Токен авторизации отклонен.", ResponseCode.ERROR_UNAUTHORIZED)
            }

            const [bearer, token] = authHeader.split(" ")
            if (bearer !== 'Bearer' || !token) {
                return ResponseError.sendError(res, "Неверный формат токена.", ResponseCode.ERROR_UNAUTHORIZED)
            }

            const tokenData = this.tokenService.getTokenData(token)
            if (!tokenData.userId) {
                return ResponseError.sendError(res, "Неверный токен.", ResponseCode.ERROR_UNAUTHORIZED);
            }

            const userData: Partial<UserData> | null = await this.userService.getById(tokenData.userId)
            if (!userData) {
                return ResponseError.sendError(res, "Авторизация не возможна. Пользователь не найден.", ResponseCode.ERROR_UNAUTHORIZED)
            }

            this.currentUser.set(new User(userData))

            next()
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    refreshAccessToken(req: Request, res: Response): void {
        try {
            const refreshToken: string | undefined = req.body?.refreshToken?.toString() || undefined
            console.log(refreshToken)
            const accessToken = this.tokenService.refreshAccessToken(refreshToken)
            ResponseSuccess.send(res, { accessToken: accessToken }, ResponseCode.SUCCESS)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }
}