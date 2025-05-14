import {Request, Response} from "express"
import {UserController} from "../src/Controllers/UserController"
import {IUserService} from "../src/Services/IUserService"
import {ITaskService} from "../src/Services/ITaskService"
import {CurrentUser} from "../src/Data/Models/CurrentUser"
import {ITokenService} from "../src/Services/ITokenService"
import {UserData} from "../src/Data/Types"

jest.mock("../src/Services/Logger/Logger", () => ({
    Logger: {
        error: jest.fn(),
        loggerService: {
            error: jest.fn(),
        },
    },
}))

describe("Регистрация пользователя", () => {
    let mockUserService: jest.Mocked<IUserService>
    let mockTaskService: jest.Mocked<ITaskService>
    let mockTokenService: jest.Mocked<ITokenService>
    let mockCurrentUser: CurrentUser
    let userController: UserController
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    let responseJson: jest.Mock
    let responseStatus: jest.Mock
    let mockUserData: UserData

    beforeEach(() => {
        mockUserService = {
            create: jest.fn(),
            update: jest.fn(),
            getById: jest.fn()
        } as jest.Mocked<IUserService>

        mockTaskService = {
            create: jest.fn(),
            update: jest.fn(),
            getById: jest.fn(),
            getCompletedTasks: jest.fn(),
            getWorkingTime: jest.fn()
        } as jest.Mocked<ITaskService>

        mockTokenService = {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            getTokenData: jest.fn(),
            refreshAccessToken: jest.fn()
        } as jest.Mocked<ITokenService>

        mockCurrentUser = new CurrentUser()

        userController = new UserController(
            mockUserService,
            mockTaskService,
            mockCurrentUser,
            mockTokenService
        )

        responseJson = jest.fn()
        responseStatus = jest.fn().mockReturnValue({json: responseJson})

        mockRequest = {
            body: {
                name: "Test User",
                email: "test@example.com"
            }
        }

        mockResponse = {
            status: responseStatus,
            json: responseJson
        }

        mockUserData = {
            id: 1,
            name: "Test User",
            email: "test@example.com",
            createdAt: new Date()
        }
    })

    it("регистрирация нового пользователя", async () => {
        mockUserService.create.mockResolvedValue(mockUserData)
        mockTokenService.generateAccessToken.mockReturnValue("mock-access-token")
        mockTokenService.generateRefreshToken.mockReturnValue("mock-refresh-token")

        await userController.createUser(mockRequest as Request, mockResponse as Response)

        expect(mockUserService.create).toHaveBeenCalledWith({
            name: "Test User",
            email: "test@example.com"
        })

        expect(responseStatus).toHaveBeenCalledWith(201)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
                id: expect.any(Number)
            })
        )
    })

    it("ошибка валидации при отсутствии обязательных полей", async () => {
        mockRequest.body = {
            name: "Test User"
        }

        await userController.createUser(mockRequest as Request, mockResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(400)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: 400,
                timestamp: expect.any(String)
            })
        )
    })

    it("ошибка валидации при некорректном формате email", async () => {
        mockRequest.body = {
            name: "Test User",
            email: "invalid-email"
        }

        await userController.createUser(mockRequest as Request, mockResponse as Response)

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