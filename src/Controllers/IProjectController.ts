import {Request, Response} from "express"

export interface IProjectController {
    createProject(req: Request, res: Response): Promise<void>
    getAll(req: Request, res: Response): Promise<void>
    getWorkingTime(req: Request, res: Response): Promise<void>
}
