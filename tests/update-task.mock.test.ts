import {Request, Response} from "express"
import {TaskController} from "../src/Controllers/TaskController"
import {ITaskService} from "../src/Services/ITaskService"
import {CurrentUser} from "../src/Data/Models/CurrentUser"
import {TaskData, TaskStatus, UserData} from "../src/Data/Types"
import {User} from "../src/Data/Models/User"
import {Task} from "../src/Data/Models/Task"
import {ResponseError} from "../src/Responses/ResponseError"

jest.mock("../src/Services/Logger/Logger", () => ({
    Logger: {
        error: jest.fn(),
        loggerService: {
            error: jest.fn(),
        },
    },
}))

describe("Обновление задачи: ", () => {
    let mockTaskService: jest.Mocked<ITaskService>
    let mockCurrentUser: CurrentUser
    let taskController: TaskController
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    let responseJson: jest.Mock
    let responseStatus: jest.Mock
    let mockTaskData: TaskData

    beforeEach(() => {
        console.log("======================================================================")
        console.log(expect.getState().currentTestName)

        mockTaskService = {
            create: jest.fn(),
            update: jest.fn(),
            getById: jest.fn(),
            getCompletedTasks: jest.fn(),
            getWorkingTime: jest.fn()
        } as jest.Mocked<ITaskService>

        mockCurrentUser = new CurrentUser()
        const mockUserData: UserData = {
            id: 1,
            name: "Иван Иваныч",
            email: "test@test.ru",
            createdAt: new Date()
        }
        mockCurrentUser.set(new User(mockUserData))

        taskController = new TaskController(
            mockTaskService,
            mockCurrentUser
        )

        responseJson = jest.fn()
        responseStatus = jest.fn().mockReturnValue({json: responseJson})

        const taskDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // +1 день

        mockRequest = {
            params: {
                taskId: "1"
            },
            body: {
                title: "Обновленная задача",
                description: "Обновленное описание задачи",
                projectId: 1,
                dueAt: taskDueDate,
                status: TaskStatus.Process
            }
        }

        mockResponse = {
            status: responseStatus,
            json: responseJson
        }

        mockTaskData = {
            id: 1,
            title: "Обновленная задача",
            description: "Обновленное описание задачи",
            projectId: 1,
            dueAt: taskDueDate,
            status: TaskStatus.Process,
            createdAt: new Date(),
            assignedToUserId: null,
            completedAt: null
        }
    })

    afterEach(async () => {
        const response = responseJson.mock.calls[0][0] instanceof ResponseError ? responseJson.mock.calls[0][0].getMessage() : responseJson.mock.calls[0][0]
        console.log("Request", mockRequest.body)
        console.log("Статус ответа:", responseStatus.mock.calls[0][0])
        console.log("Ответ:", response)
    })

    it("успешное обновление задачи", async () => {
        mockTaskService.getById.mockResolvedValue(mockTaskData)
        mockTaskService.update.mockResolvedValue(mockTaskData)

        await taskController.updateTask(mockRequest as Request, mockResponse as Response)

        expect(mockTaskService.update).toHaveBeenCalledWith(expect.objectContaining({
            ...mockRequest.body,
            id: 1
        }))
        expect(responseStatus).toHaveBeenCalledWith(200)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                id: mockTaskData.id,
                title: mockTaskData.title,
                description: mockTaskData.description,
                projectId: mockTaskData.projectId,
                status: mockTaskData.status
            })
        )
    })

    it("ошибка при обновлении несуществующей задачи", async () => {
        mockTaskService.getById.mockResolvedValue(null)
        mockTaskService.update.mockImplementation(() => {
            throw new Error("Задача не найдена")
        })

        await taskController.updateTask(mockRequest as Request, mockResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(500)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: 500,
                timestamp: expect.any(String)
            })
        )
    })

    it("ошибка валидации при неверном статусе задачи", async () => {
        mockRequest.body.status = "INVALID_STATUS"
        mockTaskService.update.mockImplementation(() => {
            throw new Error("Неверный статус")
        })

        await taskController.updateTask(mockRequest as Request, mockResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(500)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: 500,
                timestamp: expect.any(String)
            })
        )
    })

    it("ошибка валидации при несуществующем проекте", async () => {
        mockRequest.body.projectId = 9999
        mockTaskService.update.mockImplementation(() => {
            throw new Error("Проект не существует.")
        })

        await taskController.updateTask(mockRequest as Request, mockResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(500)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: 500,
                timestamp: expect.any(String)
            })
        )
    })
})