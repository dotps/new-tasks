import {Request, Response, Router} from "express"

export interface IRouter {
    getRouter(): Router
    handleRoute(req: Request, res: Response): void
}