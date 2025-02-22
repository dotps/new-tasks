import {Request, Response, NextFunction} from "express"
import {ResponseError} from "../Responses/ResponseError"
import {ResponseCode} from "../Responses/ResponseCode"

export class RequestBodyMiddleware {

    public handleJson(err: Error, req: Request, res: Response, next: NextFunction): void {
        if ('body' in err) {
            return ResponseError.sendError(res, "Невалидный JSON.", ResponseCode.ERROR_BAD_REQUEST)
        }
        next()
    }
}