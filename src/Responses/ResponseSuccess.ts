import {Response} from "express"
import {ResponseCode} from "./ResponseCode"

export class ResponseSuccess {
    static send(res: Response, data: any, statusCode: ResponseCode = ResponseCode.SUCCESS): void {
        res.status(statusCode).json(data)
    }
}