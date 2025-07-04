import {Request, Response} from "express"
import {PrismaClient} from "@prisma/client"
import {ProjectController} from "../src/controllers/project.controller"
import {UserData} from "../src/data/types"
import {User} from "../src/data/models/user"
import {ProjectDAO} from "../src/data/dao/project.dao"
import {ProjectService} from "../src/services/project.service"
import {TaskDAO} from "../src/data/dao/task.dao"
import {TaskService} from "../src/services/task.service"
import {ResponseError} from "../src/responses/response-error"
import {ResponseCode} from "../src/responses/response-code"

jest.mock("../src/services/logger/logger", () => ({
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

        const taskDAO = new TaskDAO(prisma.task)
        const taskService = new TaskService(taskDAO)

        const projectDAO = new ProjectDAO(prisma.project)
        const projectService = new ProjectService(projectDAO, taskService)

        projectController = new ProjectController(projectService)

        responseJson = jest.fn()
        responseStatus = jest.fn().mockReturnValue({json: responseJson})

        mockCreateProjectRequest = {
            body: {
                title: "Тестовый проект",
                description: "Описание тестового проекта",
                userId: testUser.id
            },
            currentUser: new User(testUser)
        } as any;

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

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.SuccessCreated)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                id: expect.any(Number),
                title: mockCreateProjectRequest.body.title,
                description: mockCreateProjectRequest.body.description,
                userId: mockCreateProjectRequest.body.userId,
                createdAt: expect.any(Date)
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
        mockCreateProjectRequest.body = { description: "Описание тестового проекта", userId: testUser.id }
        mockCreateProjectRequest.currentUser = new User(testUser)
        await projectController.createProject(mockCreateProjectRequest as Request, mockCreateProjectResponse as Response)
        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ErrorBadRequest)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: ResponseCode.ErrorBadRequest,
                timestamp: expect.any(String)
            })
        )
    })

    it("ошибка валидации при несуществующем пользователе", async () => {
        mockCreateProjectRequest.body = {
            title: "Тестовый проект",
            description: "Описание тестового проекта",
            userId: 9999999
        }
        mockCreateProjectRequest.currentUser = new User({
            id: 9999999,
            name: "Иван Иваныч",
            email: `${Date.now()}@test.ru`
        })
        await projectController.createProject(mockCreateProjectRequest as Request, mockCreateProjectResponse as Response)
        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ErrorConflict)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Ошибка в ORM. Foreign key constraint failed",
                statusCode: ResponseCode.ErrorConflict,
                timestamp: expect.any(String)
            })
        )
    })
})