import {Request, Response} from "express"
import {TaskController} from "../src/Controllers/TaskController"
import {TaskService} from "../src/Services/TaskService"
import {CurrentUser} from "../src/Data/Models/CurrentUser"
import {TaskData, TaskStatus, UserData} from "../src/Data/Types"
import {User} from "../src/Data/Models/User"
import {Task} from "../src/Data/Models/Task"
import {PrismaClient} from "@prisma/client"
import {TaskDAO} from "../src/Data/DAO/TaskDAO"
import {ResponseCode} from "../src/Responses/ResponseCode"
import {ResponseError} from "../src/Responses/ResponseError"

jest.mock("../src/Services/Logger/Logger", () => ({
    Logger: {
        error: jest.fn(),
        loggerService: {
            error: jest.fn(),
        },
    },
}))

describe("Создание задачи (с реальными сервисами): ", () => {
    let prisma: PrismaClient
    let invalidPrisma: PrismaClient
    let taskController: TaskController
    let mockCreateTaskRequest: Partial<Request>
    let mockCreateTaskResponse: Partial<Response>
    let responseJson: jest.Mock
    let responseStatus: jest.Mock
    let testUser: UserData
    let testProject: { id: number }
    let mockCurrentUser: CurrentUser

    beforeAll(async () => {
        prisma = new PrismaClient()
        await prisma.$connect()

        invalidPrisma = new PrismaClient({
            datasources: {
                db: {
                    url: "postgresql://postgres:password@nonexistenthost:5432/tasks_test"
                }
            }
        })
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    beforeEach(async () => {
        console.log("======================================================================")
        console.log(expect.getState().currentTestName)

        testUser = await prisma.user.create({
            data: {
                name: "Иван Иваныч",
                email: `${Date.now()}@test.ru`
            }
        })

        testProject = await prisma.project.create({
            data: {
                title: "Тестовый проект",
                description: "Тестовое описание проекта",
                userId: testUser.id
            }
        })

        mockCurrentUser = new CurrentUser()
        mockCurrentUser.set(new User(testUser))

        const taskDAO = new TaskDAO(prisma.task)
        const taskService = new TaskService(taskDAO)
        taskController = new TaskController(taskService, mockCurrentUser)

        responseJson = jest.fn()
        responseStatus = jest.fn().mockReturnValue({json: responseJson})

        const taskDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // +1 день

        mockCreateTaskRequest = {
            body: {
                title: "Тестовая задача",
                description: "Описание тестовой задачи",
                projectId: testProject.id,
                dueAt: taskDueDate
            }
        }

        mockCreateTaskResponse = {
            status: responseStatus,
            json: responseJson
        }
    })

    afterEach(async () => {
        const response = responseJson.mock.calls[0][0] instanceof ResponseError ? responseJson.mock.calls[0][0].getMessage() : responseJson.mock.calls[0][0]
        console.log("Request", mockCreateTaskRequest.body)
        console.log("Статус ответа:", responseStatus.mock.calls[0][0])
        console.log("Ответ:", response)
    })

    it("создание новой задачи", async () => {
        await taskController.createTask(mockCreateTaskRequest as Request, mockCreateTaskResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(201)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                id: expect.any(Number),
                title: mockCreateTaskRequest.body.title,
                description: mockCreateTaskRequest.body.description,
                projectId: mockCreateTaskRequest.body.projectId,
                status: TaskStatus.Created
            })
        )

        const createdTask = await prisma.task.findFirst({where: {projectId: testProject.id}})

        expect(createdTask).toBeTruthy()
        expect(createdTask?.title).toBe(mockCreateTaskRequest.body.title)
        expect(createdTask?.description).toBe(mockCreateTaskRequest.body.description)
        expect(createdTask?.projectId).toBe(mockCreateTaskRequest.body.projectId)
        expect(createdTask?.status).toBe(TaskStatus.Created)
    })

    it("ошибка валидации при отсутствии обязательных полей", async () => {
        delete mockCreateTaskRequest.body.title

        await taskController.createTask(mockCreateTaskRequest as Request, mockCreateTaskResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ErrorBadRequest)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: ResponseCode.ErrorBadRequest,
                timestamp: expect.any(String)
            })
        )
    })

    it("ошибка валидации при отсутствии projectId", async () => {
        delete mockCreateTaskRequest.body.projectId

        await taskController.createTask(mockCreateTaskRequest as Request, mockCreateTaskResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ErrorBadRequest)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: ResponseCode.ErrorBadRequest,
                timestamp: expect.any(String)
            })
        )
    })

    it("задача привязана к несуществующему проекту", async () => {
        mockCreateTaskRequest.body.projectId = 99999999

        await taskController.createTask(mockCreateTaskRequest as Request, mockCreateTaskResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ErrorConflict)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: ResponseCode.ErrorConflict,
                timestamp: expect.any(String)
            })
        )
    })

    it("ошибка при невозможности подключиться к БД", async () => {
        const taskDAO = new TaskDAO(invalidPrisma.task)
        const taskService = new TaskService(taskDAO)
        const taskController = new TaskController(taskService, mockCurrentUser)

        await taskController.createTask(mockCreateTaskRequest as Request, mockCreateTaskResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ServerError)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Ошибка в ORM.",
                statusCode: ResponseCode.ServerError,
                timestamp: expect.any(String)
            })
        )
    })
})