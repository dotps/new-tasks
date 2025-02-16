import {NextFunction, Request, Response} from "express"
import {ResponseError} from "../ResponseError"
import {ResponseCode} from "../ResponseCode"

export class AuthMiddleware {

    public handle(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return ResponseError.sendError(res, "Токен авторизации отклонен.", ResponseCode.ERROR_UNAUTHORIZED)
        }

        const [bearer, token] = authHeader.split(" ")

        if (bearer !== 'Bearer' || !token) {
            return ResponseError.sendError(res, "Неверный формат токена.", ResponseCode.ERROR_UNAUTHORIZED)
        }

        const userId = this.decodeToken(token)

        if (!userId) {
            return ResponseError.sendError(res, "Неверный токен.", ResponseCode.ERROR_UNAUTHORIZED);
        }

        // TODO: какой вариант лучше res.locals или расширить req
        res.locals.userId = userId
        req.userId = userId

        next()
    }

    private decodeToken(token: string): number | undefined {
        return Number(token) || undefined
    }
}