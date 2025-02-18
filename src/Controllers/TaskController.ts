import {Request, Response} from "express";
import {ITaskController} from "./ITaskController";
import {TaskData, toTaskStatus} from "../Data/Types";
import {Task} from "../Models/Task";
import {ITaskService} from "../Services/ITaskService";
import {ResponseSuccess} from "../ResponseSuccess"
import {ResponseCode} from "../ResponseCode"
import {ResponseError} from "../ResponseError"
import {TaskValidator} from "../Validation/TaskValidator"
import {CurrentUser} from "../CurrentUser"
import {ValidationError} from "../ValidationError"

export class TaskController implements ITaskController {
    private readonly taskService: ITaskService
    private readonly currentUser: CurrentUser

    constructor(taskService: ITaskService, currentUser: CurrentUser) {
        this.taskService = taskService
        this.currentUser = currentUser
        // this.createTask = this.createTask.bind(this)
        // this.updateTask = this.updateTask.bind(this)
        // this.updateStatus = this.updateStatus.bind(this)
        // this.assignUser = this.assignUser.bind(this)
    }

    async createTask(req: Request, res: Response): Promise<void> {
        const task = new Task(req.body)

        try {
            const validator = new TaskValidator(task)
            if (!validator.isValidCreateData()) return
            const taskData: TaskData = await this.taskService.create(task.toCreateData())
            ResponseSuccess.send(res, taskData, ResponseCode.SUCCESS_CREATED)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        const taskData = {
            ...req.body,
            id: Number(req.params.taskId) || undefined
        }
        const task = new Task(taskData)

        try {
            const validator = new TaskValidator(task)
            if (!validator.isValidUpdateData()) return
            const taskData: TaskData = await this.taskService.update(task.toUpdateData())
            ResponseSuccess.send(res, taskData, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {

        // Пользователь отправляет запрос для изменения статуса задачи (например, с «в процессе» на «завершена»).
        // Поменять статус может только исполнитель задачи.
        // Сервис обновляет статус задачи в базе данных, и если задача завершена, фиксирует в бд время, затраченное на выполнение.

        try {
            const normalizedData: Partial<TaskData> = new Task(req.body).toUpdateData()
            const updateStatusData: Partial<TaskData> = {
                id: Number(req.params.taskId) || undefined,
                status: normalizedData.status
            }

            const validator = new TaskValidator(new Task(updateStatusData))
            if (!validator.isValidUpdateStatusData()) return

            // TODO: тут
            const currentTaskData: TaskData | null = await this.taskService.getById(updateStatusData.id!)
            if (!currentTaskData) {
                throw new Error("Задача не найдена.");
            }

            if (currentTaskData.assignedToUserId !== this.currentUser.getId()) {
                throw new Error("Только исполнитель задачи может изменить её статус.");
            }

            const result: TaskData = await this.taskService.update(updateStatusData)
            ResponseSuccess.send(res, result, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }

    // TODO: назначение исполнителя задачи
    async assignUser(req: Request, res: Response): Promise<void> {
        // const taskId = Number(req.params.taskId) || undefined
        // const userId = Number(req.body.userId) || undefined
        const currentUserId = this.currentUser.getId()

        // TODO: продолжить

        // if (!taskId) {
        //     return ResponseError.sendError(res, "Не указан id задачи.", ResponseCode.ERROR_BAD_REQUEST)
        // }

        // if (!taskId || !userId) {
        //     return ResponseError.sendError(res, "Неверные входные данные.", ResponseCode.ERROR_BAD_REQUEST)
        // }

        // if (userId !== currentUserId) {
        //     return ResponseError.sendError(res, "Вы можете назначить только себя исполнителем.", ResponseCode.ERROR_FORBIDDEN);
        // }

        // TODO: нужно ли проверять присутствие userId в БД перед операциями или ORM выдаст ошибку сам?

        try {
            const taskData = {
                id: Number(req.params.taskId),
                userId: currentUserId,
            }
            const task = new Task(taskData)
            console.log(task)

            // const validator = new TaskValidator(task)
            // if (!validator.isValidAssignUser()) return
            const result: TaskData = await this.taskService.update(task.toUpdateData())
            ResponseSuccess.send(res, result, ResponseCode.SUCCESS)
        }
        catch (error) {
            ResponseError.send(res, error)
        }
    }


}
