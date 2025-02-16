import {Request, Response} from "express"

export interface IProjectController {
    createProject(req: Request, res: Response): Promise<void>
}
