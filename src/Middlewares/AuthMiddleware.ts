import {Request, Response, NextFunction} from "express"
import {ResponseError} from "../ResponseError"
import {ResponseCode} from "../ResponseCode"

export class AuthMiddleware {

    public handle(req: Request, res: Response, next: NextFunction): void {
        const auth = req.headers.authorization
        if (!auth) {
            return ResponseError.send(res, "Токен авторизации отклонен.", ResponseCode.ERROR_UNAUTHORIZED)
        }
        next()
    }
}