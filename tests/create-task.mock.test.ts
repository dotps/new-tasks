import {Request, Response} from "express"
import {ITaskService} from "../src/services/task.service.interface"
import {TaskController} from "../src/controllers/task.controller"
import {TaskData, UserData} from "../src/data/types"
import {User} from "../src/data/models/user"
import {TaskStatus} from "@prisma/client"
import {ResponseError} from "../src/responses/response-error"
import {Task} from "../src/data/models/task"
import {ValidationError} from "../src/errors/validation-error"

jest.mock("../src/services/logger/logger", () => ({
    Logger: {
        error: jest.fn(),
        loggerService: {
            error: jest.fn(),
        },
    },
}))

describe("Создание задачи: ", () => {
    let mockTaskService: jest.Mocked<ITaskService>
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
            getWorkingTime: jest.fn(),
            updateStatus: jest.fn(),
            assignUser: jest.fn(),
            toCreateData: jest.fn(data => new Task(data).toCreateData()),
            toUpdateData: jest.fn(),
            toUpdateStatusData: jest.fn(),
            toUpdateAssignedUserData: jest.fn()
        } as jest.Mocked<ITaskService>

        const mockUserData: UserData = {
            id: 1,
            name: "Иван Иваныч",
            email: "test@test.ru",
            createdAt: new Date()
        }

        taskController = new TaskController(
            mockTaskService
        )

        responseJson = jest.fn()
        responseStatus = jest.fn().mockReturnValue({json: responseJson})

        const taskDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // +1 день

        mockRequest = {
            body: {
                title: "Тестовая задача",
                description: "Описание тестовой задачи",
                projectId: 1,
                dueAt: taskDueDate
            }
        }

        mockResponse = {
            status: responseStatus,
            json: responseJson
        }

        mockTaskData = {
            id: 1,
            title: "Тестовая задача",
            description: "Описание тестовой задачи",
            projectId: 1,
            dueAt: taskDueDate,
            status: TaskStatus.Created,
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

    it("создание новой задачи", async () => {
        mockTaskService.create.mockResolvedValue(mockTaskData)

        await taskController.createTask(mockRequest as Request, mockResponse as Response)

        const expectedData = new Task(mockRequest.body).toCreateData()
        expect(mockTaskService.create).toHaveBeenCalledWith(expectedData)

        expect(responseStatus).toHaveBeenCalledWith(201)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                id: expect.any(Number),
                title: mockTaskData.title,
                description: mockTaskData.description,
                projectId: mockTaskData.projectId,
                status: mockTaskData.status
            })
        )
    })

    it("ошибка валидации при отсутствии обязательных полей", async () => {
        mockTaskService.create.mockImplementation(() => { throw new ValidationError("Входные данные не валидны", 400) })
        delete mockRequest.body.title

        await taskController.createTask(mockRequest as Request, mockResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(400)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: 400,
                timestamp: expect.any(String)
            })
        )
    })

    it("ошибка валидации при отсутствии projectId", async () => {
        mockTaskService.create.mockImplementation(() => { throw new ValidationError("Входные данные не валидны", 400) })
        delete mockRequest.body.projectId

        await taskController.createTask(mockRequest as Request, mockResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(400)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: 400,
                timestamp: expect.any(String)
            })
        )
    })
})