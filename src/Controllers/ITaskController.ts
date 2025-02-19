import {Request, Response} from "express"

export interface ITaskController {
    createTask(req: Request, res: Response): Promise<void>
    updateTask(req: Request, res: Response): Promise<void>
    assignSelf(req: Request, res: Response): Promise<void>
    updateStatus(req: Request, res: Response): Promise<void>
}
