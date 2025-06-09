import {Request, Response, NextFunction} from "express"
import {ResponseError} from "../responses/response-error"
import {ResponseCode} from "../responses/response-code"

export class RequestBodyMiddleware {

    public handleJson(err: Error, req: Request, res: Response, next: NextFunction): void {
        if ('body' in err) {
            return ResponseError.sendError(res, "Невалидный JSON.", ResponseCode.ErrorBadRequest)
        }
        next()
    }
}