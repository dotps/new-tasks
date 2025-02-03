import {Request, Response} from "express"

export interface ITaskController {
    createProject(req: Request, res: Response): Promise<void>
    createTask(req: Request, res: Response): Promise<void>
}
