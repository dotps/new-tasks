import {Request, Response} from "express"
import {IProjectService} from "../src/services/project.service.interface"
import {ITaskService} from "../src/services/task.service.interface"
import {ProjectController} from "../src/controllers/project.controller"
import {ProjectData, UserData} from "../src/data/types"
import {User} from "../src/data/models/user"
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

describe("Создание проекта: ", () => {
    let mockProjectService: jest.Mocked<IProjectService>
    let mockTaskService: jest.Mocked<ITaskService>
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
            getProjectsWithTasks: jest.fn(),
            toCreateData: jest.fn(data => data),
            getWorkingTime: jest.fn()
        } as jest.Mocked<IProjectService>

        mockTaskService = {
            create: jest.fn(),
            update: jest.fn(),
            getById: jest.fn(),
            getCompletedTasks: jest.fn(),
            getWorkingTime: jest.fn(),
            updateStatus: jest.fn(),
            assignUser: jest.fn(),
            toCreateData: jest.fn(),
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

        projectController = new ProjectController(
            mockProjectService
        )

        responseJson = jest.fn()
        responseStatus = jest.fn().mockReturnValue({json: responseJson})

        mockRequest = {
            body: {
                title: "Тестовый проект",
                description: "Описание тестового проекта",
                userId: 1
            },
            currentUser: new User(mockUserData)
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

        expect(mockProjectService.create.mock.calls[0][0]).toEqual({
            title: mockRequest.body.title,
            description: mockRequest.body.description,
            userId: mockRequest.body.userId
        })

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
        mockProjectService.create.mockImplementation(() => { throw new ValidationError("Входные данные не валидны", 400) })
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