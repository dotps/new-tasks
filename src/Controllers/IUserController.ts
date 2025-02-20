import {Request, Response} from "express"

export interface IUserController {
    createUser(req: Request, res: Response): Promise<void>
    getWorkingTime(req: Request, res: Response): Promise<void>
}
