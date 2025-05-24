import {Request, Response} from "express"
import {ProjectController} from "../src/Controllers/ProjectController"
import {ProjectService} from "../src/Services/ProjectService"
import {CurrentUser} from "../src/Data/Models/CurrentUser"
import {ProjectData, UserData} from "../src/Data/Types"
import {User} from "../src/Data/Models/User"
import {PrismaClient} from "@prisma/client"
import {ProjectDAO} from "../src/Data/DAO/ProjectDAO"
import {ResponseCode} from "../src/Responses/ResponseCode"
import {ResponseError} from "../src/Responses/ResponseError"
import {TaskService} from "../src/Services/TaskService"
import {TaskDAO} from "../src/Data/DAO/TaskDAO"

jest.mock("../src/Services/Logger/Logger", () => ({
    Logger: {
        error: jest.fn(),
        loggerService: {
            error: jest.fn(),
        },
    },
}))

describe("Создание проекта (с реальными сервисами): ", () => {
    let prisma: PrismaClient
    let invalidPrisma: PrismaClient
    let projectController: ProjectController
    let mockCreateProjectRequest: Partial<Request>
    let mockCreateProjectResponse: Partial<Response>
    let responseJson: jest.Mock
    let responseStatus: jest.Mock
    let testUser: UserData
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

        mockCurrentUser = new CurrentUser()
        mockCurrentUser.set(new User(testUser))

        const projectDAO = new ProjectDAO(prisma.project)
        const projectService = new ProjectService(projectDAO)
        const taskDAO = new TaskDAO(prisma.task)
        const taskService = new TaskService(taskDAO)
        projectController = new ProjectController(projectService, taskService, mockCurrentUser)

        responseJson = jest.fn()
        responseStatus = jest.fn().mockReturnValue({json: responseJson})

        mockCreateProjectRequest = {
            body: {
                title: "Тестовый проект",
                description: "Описание тестового проекта",
                userId: testUser.id
            }
        }

        mockCreateProjectResponse = {
            status: responseStatus,
            json: responseJson
        }
    })

    afterEach(async () => {
        const response = responseJson.mock.calls[0][0] instanceof ResponseError ? responseJson.mock.calls[0][0].getMessage() : responseJson.mock.calls[0][0]
        console.log("Request", mockCreateProjectRequest.body)
        console.log("Статус ответа:", responseStatus.mock.calls[0][0])
        console.log("Ответ:", response)
    })
    it("создание нового проекта", async () => {
        await projectController.createProject(mockCreateProjectRequest as Request, mockCreateProjectResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.SUCCESS_CREATED)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                id: expect.any(Number),
                title: mockCreateProjectRequest.body.title,
                description: mockCreateProjectRequest.body.description,
                userId: testUser.id
            })
        )

        const createdProject = await prisma.project.findFirst({
            where: {
                userId: testUser.id
            }
        })

        expect(createdProject).toBeTruthy()
        expect(createdProject?.title).toBe(mockCreateProjectRequest.body.title)
        expect(createdProject?.description).toBe(mockCreateProjectRequest.body.description)
        expect(createdProject?.userId).toBe(testUser.id)
    })

    it("ошибка валидации при отсутствии обязательных полей", async () => {
        delete mockCreateProjectRequest.body.title

        await projectController.createProject(mockCreateProjectRequest as Request, mockCreateProjectResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ERROR_BAD_REQUEST)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: ResponseCode.ERROR_BAD_REQUEST,
                timestamp: expect.any(String)
            })
        )
    })

    it("ошибка валидации при несуществующем пользователе", async () => {
        mockCurrentUser.set(new User({
            id: 9999999,
            name: "Иван Иваныч",
            email: `${Date.now()}@test.ru`
        }))

        await projectController.createProject(mockCreateProjectRequest as Request, mockCreateProjectResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ERROR_CONFLICT)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: ResponseCode.ERROR_CONFLICT,
                timestamp: expect.any(String)
            })
        )
    })
    it("ошибка при невозможности подключиться к БД", async () => {
        const projectDAO = new ProjectDAO(invalidPrisma.project)
        const projectService = new ProjectService(projectDAO)
        const taskDAO = new TaskDAO(invalidPrisma.task)
        const taskService = new TaskService(taskDAO)
        const projectController = new ProjectController(projectService, taskService, mockCurrentUser)

        await projectController.createProject(mockCreateProjectRequest as Request, mockCreateProjectResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.SERVER_ERROR)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Ошибка в ORM.",
                statusCode: ResponseCode.SERVER_ERROR,
                timestamp: expect.any(String)
            })
        )
    })
})