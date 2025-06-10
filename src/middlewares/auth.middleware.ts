import {NextFunction, Request, Response} from "express"
import {CurrentUser} from "../data/models/current-user"
import {ITokenService} from "../services/token.service.interface"
import {IUserService} from "../services/user.service.interface"
import {ResponseError} from "../responses/response-error"
import {ResponseCode} from "../responses/response-code"
import {UserData} from "../data/types"
import {User} from "../data/models/user"
import {ResponseSuccess} from "../responses/response-success"

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
            const authHeader = req.headers.authorization

            if (!authHeader) {
                return ResponseError.sendError(res, "Токен авторизации отклонен.", ResponseCode.ErrorUnauthorized)
            }

            const [bearer, token] = authHeader.split(" ")

            if (bearer !== "Bearer" || !token) {
                return ResponseError.sendError(res, "Неверный формат токена.", ResponseCode.ErrorUnauthorized)
            }

            const tokenData = this.tokenService.getTokenData(token)

            if (!tokenData.userId) {
                return ResponseError.sendError(res, "Неверный токен.", ResponseCode.ErrorUnauthorized)
            }

            const userData: Partial<UserData> | null = await this.userService.getById(tokenData.userId)

            if (!userData) {
                return ResponseError.sendError(res, "Авторизация не возможна. Пользователь не найден.", ResponseCode.ErrorUnauthorized)
            }

            this.currentUser.set(new User(userData))
            next()
        } catch (error) {
            ResponseError.send(res, error)
        }
    }

    refreshAccessToken(req: Request, res: Response): void {
        try {
            const refreshToken: string | undefined = req.body?.refreshToken?.toString() || undefined
            const accessToken = this.tokenService.refreshAccessToken(refreshToken)

            ResponseSuccess.send(res, {accessToken: accessToken}, ResponseCode.Success)
        } catch (error) {
            ResponseError.send(res, error)
        }
    }
}