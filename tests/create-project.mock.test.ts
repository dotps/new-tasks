import {Request, Response} from "express"
import {ProjectController} from "../src/Controllers/ProjectController"
import {IProjectService} from "../src/Services/IProjectService"
import {CurrentUser} from "../src/Data/Models/CurrentUser"
import {ProjectData, UserData} from "../src/Data/Types"
import {User} from "../src/Data/Models/User"
import {ITaskService} from "../src/Services/ITaskService"
import {ResponseError} from "../src/Responses/ResponseError"

jest.mock("../src/Services/Logger/Logger", () => ({
    Logger: {
        error: jest.fn(),
        loggerService: {
            error: jest.fn(),
        },
    },
}))

describe("Создание проекта: ", () => {
    let mockProjectService: jest.Mocked<IProjectService>
    let mockTaskService: jest.Mocked<ITaskService>
    let mockCurrentUser: CurrentUser
    let projectController: ProjectController
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    let responseJson: jest.Mock
    let responseStatus: jest.Mock
    let mockProjectData: ProjectData

    beforeEach(() => {
        console.log("======================================================================")
        console.log(expect.getState().currentTestName)

        mockProjectService = {
            create: jest.fn(),
            update: jest.fn(),
            getProjectsWithTasks: jest.fn()
        } as jest.Mocked<IProjectService>

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

        projectController = new ProjectController(
            mockProjectService,
            mockTaskService,
            mockCurrentUser
        )

        responseJson = jest.fn()
        responseStatus = jest.fn().mockReturnValue({json: responseJson})

        mockRequest = {
            body: {
                title: "Тестовый проект",
                description: "Описание тестового проекта",
                userId: 1
            }
        }

        mockResponse = {
            status: responseStatus,
            json: responseJson
        }

        mockProjectData = {
            id: 1,
            title: "Тестовый проект",
            description: "Описание тестового проекта",
            userId: 1,
            createdAt: new Date()
        }
    })

    afterEach(async () => {
        const response = responseJson.mock.calls[0][0] instanceof ResponseError ? responseJson.mock.calls[0][0].getMessage() : responseJson.mock.calls[0][0]
        console.log("Request", mockRequest.body)
        console.log("Статус ответа:", responseStatus.mock.calls[0][0])
        console.log("Ответ:", response)
    })

    it("создание нового проекта", async () => {
        mockProjectService.create.mockResolvedValue(mockProjectData)

        await projectController.createProject(mockRequest as Request, mockResponse as Response)

        const expectedData = {
            title: mockRequest.body.title,
            description: mockRequest.body.description,
            userId: mockRequest.body.userId
        }
        expect(mockProjectService.create).toHaveBeenCalledWith(expectedData)

        expect(responseStatus).toHaveBeenCalledWith(201)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                id: expect.any(Number),
                title: mockProjectData.title,
                description: mockProjectData.description,
                userId: mockProjectData.userId
            })
        )
    })

    it("ошибка валидации при отсутствии обязательных полей", async () => {
        delete mockRequest.body.title

        await projectController.createProject(mockRequest as Request, mockResponse as Response)

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