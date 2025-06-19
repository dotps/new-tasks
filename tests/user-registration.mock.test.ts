import {Request, Response} from "express"
import {IUserService} from "../src/services/user.service.interface"
import {ITokenService} from "../src/services/token.service.interface"
import {CurrentUser} from "../src/data/models/current-user"
import {UserController} from "../src/controllers/user.controller"
import {UserData} from "../src/data/types"
import {ResponseError} from "../src/responses/response-error"
import {ValidationError} from "../src/errors/validation-error"

jest.mock("../src/services/logger/logger", () => ({
    Logger: {
        error: jest.fn(),
        loggerService: {
            error: jest.fn(),
        },
    },
}))

describe("Регистрация пользователя", () => {
    let mockUserService: jest.Mocked<IUserService>
    let mockTokenService: jest.Mocked<ITokenService>
    let mockCurrentUser: CurrentUser
    let userController: UserController
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    let responseJson: jest.Mock
    let responseStatus: jest.Mock
    let mockUserData: UserData

    beforeEach(() => {
        console.log("======================================================================")
        console.log(expect.getState().currentTestName)

        mockUserService = {
            create: jest.fn(),
            update: jest.fn(),
            getById: jest.fn(),
            toCreateData: jest.fn(data => data),
            getWorkingTime: jest.fn()
        } as jest.Mocked<IUserService>

        mockTokenService = {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            getTokenData: jest.fn(),
            refreshAccessToken: jest.fn()
        } as jest.Mocked<ITokenService>

        mockCurrentUser = new CurrentUser()

        userController = new UserController(
            mockUserService,
            mockTokenService
        )

        responseJson = jest.fn()
        responseStatus = jest.fn().mockReturnValue({json: responseJson})

        mockRequest = {
            body: {
                name: "Иван Иваныч",
                email: "test@test.ru"
            }
        }

        mockResponse = {
            status: responseStatus,
            json: responseJson
        }

        mockUserData = {
            id: 1,
            name: "Иван Иваныч",
            email: "test@test.ru",
            createdAt: new Date()
        }
    })

    afterEach(async () => {
        const response = responseJson.mock.calls[0][0] instanceof ResponseError ? responseJson.mock.calls[0][0].getMessage() : responseJson.mock.calls[0][0]
        console.log("Request", mockRequest.body)
        console.log("Статус ответа:", responseStatus.mock.calls[0][0])
        console.log("Ответ:", response)
    })

    it("регистрирация нового пользователя", async () => {
        mockUserService.create.mockResolvedValue(mockUserData)
        mockTokenService.generateAccessToken.mockReturnValue("mock-access-token")
        mockTokenService.generateRefreshToken.mockReturnValue("mock-refresh-token")

        await userController.createUser(mockRequest as Request, mockResponse as Response)

        expect(mockUserService.create).toHaveBeenCalledWith({
            name: mockRequest.body.name,
            email: mockRequest.body.email
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
        mockUserService.create.mockImplementation(() => { throw new ValidationError("Входные данные не валидны", 400) })
        delete mockRequest.body.email

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
        mockUserService.create.mockImplementation(() => { throw new ValidationError("Входные данные не валидны", 400) })
        mockRequest.body.email = "email"

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