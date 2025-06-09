import {Request, Response} from "express"
import {UserController} from "../src/controllers/user.controller"
import {UserDAO} from "../src/data/dao/user.dao"
import {TaskDAO} from "../src/data/dao/task.dao"
import {UserService} from "../src/services/user.service"
import {TaskService} from "../src/services/task.service"
import {SimpleTokenService} from "../src/services/simple-token.service"
import {CurrentUser} from "../src/data/models/current-user"
import {ResponseError} from "../src/responses/response-error"
import {ResponseCode} from "../src/responses/response-code"
import {PrismaClient} from "@prisma/client"

jest.mock("../src/services/logger/logger", () => ({
    Logger: {
        error: jest.fn(),
        loggerService: {
            error: jest.fn(),
        },
    },
}))

describe("Регистрация пользователя (с реальными сервисами):", () => {
    let prisma: PrismaClient
    let invalidPrisma: PrismaClient
    let userController: UserController
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    let responseJson: jest.Mock
    let responseStatus: jest.Mock

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

        const userDAO = new UserDAO(prisma.user)
        const taskDAO = new TaskDAO(prisma.task)
        const userService = new UserService(userDAO)
        const taskService = new TaskService(taskDAO)
        const tokenService = new SimpleTokenService()
        const currentUser = new CurrentUser()

        userController = new UserController(
            userService,
            taskService,
            currentUser,
            tokenService
        )

        responseJson = jest.fn()
        responseStatus = jest.fn().mockReturnValue({json: responseJson})

        const uniqueEmail = Date.now() + "@test.ru"

        mockRequest = {
            body: {
                name: "Иван Иваныч",
                email: uniqueEmail
            }
        }

        mockResponse = {
            status: responseStatus,
            json: responseJson
        }
    })

    afterEach(async () => {
        const response = responseJson.mock.calls[0][0] instanceof ResponseError ? responseJson.mock.calls[0][0].getMessage() : responseJson.mock.calls[0][0]
        console.log("Request", mockRequest.body)
        console.log("Статус ответа:", responseStatus.mock.calls[0][0])
        console.log("Ответ:", response)
    })

    it("регистрация нового пользователя", async () => {
        await userController.createUser(mockRequest as Request, mockResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(201)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
                id: expect.any(Number)
            })
        )

        const createdUser = await prisma.user.findFirst({where: {email: mockRequest.body.email}})

        expect(createdUser).toBeTruthy()
        expect(createdUser?.name).toBe(mockRequest.body.name)
        expect(createdUser?.email).toBe(mockRequest.body.email)

        console.log("Созданный пользователь", createdUser)
    })

    it("ошибка валидации при отсутствии полей", async () => {
        delete mockRequest.body.email
        delete mockRequest.body.name

        await userController.createUser(mockRequest as Request, mockResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ErrorBadRequest)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: ResponseCode.ErrorBadRequest,
                timestamp: expect.any(String)
            })
        )
    })

    it("ошибка валидации при отсутствии обязательных полей", async () => {
        delete mockRequest.body.email

        await userController.createUser(mockRequest as Request, mockResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ErrorBadRequest)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: ResponseCode.ErrorBadRequest,
                timestamp: expect.any(String)
            })
        )
    })

    it("ошибка валидации при некорректном формате email", async () => {
        mockRequest.body.email = "email"

        await userController.createUser(mockRequest as Request, mockResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ErrorBadRequest)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: ResponseCode.ErrorBadRequest,
                timestamp: expect.any(String)
            })
        )
    })

    it("не даст создать пользователя с существующим email", async () => {
        await userController.createUser(mockRequest as Request, mockResponse as Response)
        const createdUser = await prisma.user.findFirst({
            where: {
                email: mockRequest.body.email
            }
        })

        console.log("Созданный пользователь", createdUser)

        responseJson.mockClear()
        responseStatus.mockClear()

        const userDAO = new UserDAO(prisma.user)
        const taskDAO = new TaskDAO(prisma.task)
        const userService = new UserService(userDAO)
        const taskService = new TaskService(taskDAO)
        const tokenService = new SimpleTokenService()
        const currentUser = new CurrentUser()

        userController = new UserController(
            userService,
            taskService,
            currentUser,
            tokenService
        )

        console.log("Пытаемся создать второго пользователя с тем же email")
        await userController.createUser(mockRequest as Request, mockResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ErrorConflict)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining("Unique constraint failed"),
                statusCode: ResponseCode.ErrorConflict,
                timestamp: expect.any(String)
            })
        )

        const users = await prisma.user.findMany({where: {email: mockRequest.body.email}})

        expect(users).toHaveLength(1)

        console.log("Пользователей с таким e-mail", users)
    })

    it("ошибка при невозможности подключиться к БД", async () => {
        const userDAO = new UserDAO(invalidPrisma.user)
        const taskDAO = new TaskDAO(invalidPrisma.task)
        const userService = new UserService(userDAO)
        const taskService = new TaskService(taskDAO)
        const tokenService = new SimpleTokenService()
        const currentUser = new CurrentUser()

        userController = new UserController(
            userService,
            taskService,
            currentUser,
            tokenService
        )

        await userController.createUser(mockRequest as Request, mockResponse as Response)

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