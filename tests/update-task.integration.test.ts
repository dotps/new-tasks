import {Request, Response} from "express"
import {TaskController} from "../src/Controllers/TaskController"
import {TaskService} from "../src/Services/TaskService"
import {CurrentUser} from "../src/Data/Models/CurrentUser"
import {TaskData, TaskStatus, UserData} from "../src/Data/Types"
import {User} from "../src/Data/Models/User"
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

describe("Обновление задачи (с реальными сервисами): ", () => {
    let prisma: PrismaClient
    let invalidPrisma: PrismaClient
    let taskController: TaskController
    let mockUpdateTaskRequest: Partial<Request>
    let mockUpdateTaskResponse: Partial<Response>
    let responseJson: jest.Mock
    let responseStatus: jest.Mock
    let testUser: UserData
    let testProject: { id: number }
    let testTask: { id: number }
    let mockCurrentUser: CurrentUser

    beforeAll(async () => {
        prisma = new PrismaClient()
        await prisma.$connect()

        invalidPrisma = new PrismaClient({
            datasources: {
                db: {
                    url: "postgresql://postgres:password@localhost:5432/tasks"
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

        const taskDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // +1 день

        testTask = await prisma.task.create({
            data: {
                title: "Тестовая задача",
                description: "Описание тестовой задачи",
                projectId: testProject.id,
                status: TaskStatus.CREATED,
                dueAt: taskDueDate
            }
        })

        mockCurrentUser = new CurrentUser()
        mockCurrentUser.set(new User(testUser))

        const taskDAO = new TaskDAO(prisma.task)
        const taskService = new TaskService(taskDAO)
        taskController = new TaskController(taskService, mockCurrentUser)

        responseJson = jest.fn()
        responseStatus = jest.fn().mockReturnValue({json: responseJson})

        mockUpdateTaskRequest = {
            params: {
                taskId: testTask.id.toString()
            },
            body: {
                title: "Обновленная задача",
                description: "Обновленное описание задачи",
                projectId: testProject.id,
                dueAt: taskDueDate,
                status: TaskStatus.PROCESS
            }
        }

        mockUpdateTaskResponse = {
            status: responseStatus,
            json: responseJson
        }
    })

    afterEach(async () => {
        const response = responseJson.mock.calls[0][0] instanceof ResponseError ? responseJson.mock.calls[0][0].getMessage() : responseJson.mock.calls[0][0]
        console.log("Request", mockUpdateTaskRequest.body)
        console.log("Статус ответа:", responseStatus.mock.calls[0][0])
        console.log("Ответ:", response)
    })

    it("успешное обновление задачи", async () => {
        await taskController.updateTask(mockUpdateTaskRequest as Request, mockUpdateTaskResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(200)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                id: testTask.id,
                title: mockUpdateTaskRequest.body.title,
                description: mockUpdateTaskRequest.body.description,
                projectId: mockUpdateTaskRequest.body.projectId,
                status: mockUpdateTaskRequest.body.status
            })
        )

        const updatedTask = await prisma.task.findUnique({
            where: { id: testTask.id }
        })

        expect(updatedTask).toBeTruthy()
        expect(updatedTask?.title).toBe(mockUpdateTaskRequest.body.title)
        expect(updatedTask?.description).toBe(mockUpdateTaskRequest.body.description)
        expect(updatedTask?.projectId).toBe(mockUpdateTaskRequest.body.projectId)
        expect(updatedTask?.status).toBe(mockUpdateTaskRequest.body.status)
    })

    it("ошибка при обновлении несуществующей задачи", async () => {
        if (!mockUpdateTaskRequest.params) {
            mockUpdateTaskRequest.params = {}
        }
        mockUpdateTaskRequest.params.taskId = "999999"

        await taskController.updateTask(mockUpdateTaskRequest as Request, mockUpdateTaskResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ERROR_NOT_FOUND)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                statusCode: ResponseCode.ERROR_NOT_FOUND,
                timestamp: expect.any(String)
            })
        )
    })

    it("при неверном статусе задачи, он игнорируется и необновляется", async () => {
        mockUpdateTaskRequest.body.title += " - неверный статус задачи"
        mockUpdateTaskRequest.body.status = "INVALID_STATUS"

        await taskController.updateTask(mockUpdateTaskRequest as Request, mockUpdateTaskResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.SUCCESS)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                id: expect.any(Number),
                title: mockUpdateTaskRequest.body.title,
                description: mockUpdateTaskRequest.body.description,
                projectId: mockUpdateTaskRequest.body.projectId,
            })
        )
    })

    it("привяжем к несуществующему проекту", async () => {
        mockUpdateTaskRequest.body.projectId = 99999

        await taskController.updateTask(mockUpdateTaskRequest as Request, mockUpdateTaskResponse as Response)

        expect(responseStatus).toHaveBeenCalledWith(ResponseCode.ERROR_CONFLICT)
        expect(responseJson).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: ResponseCode.ERROR_CONFLICT,
            })
        )
    })

    it("ошибка при невозможности подключиться к БД", async () => {
        const taskDAO = new TaskDAO(invalidPrisma.task)
        const taskService = new TaskService(taskDAO)
        const taskController = new TaskController(taskService, mockCurrentUser)

        await taskController.updateTask(mockUpdateTaskRequest as Request, mockUpdateTaskResponse as Response)

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