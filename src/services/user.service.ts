import {CompletedTasksFilter, UserData, ValidationType, WorkingTimeData} from "../data/types"
import {IUserService} from "./user.service.interface"
import {IUserDAO} from "../data/dao/user.dao.interface"
import {User} from "../data/models/user"
import {UserValidator} from "./validation/user.validator"
import {ITaskService} from "./task.service.interface"

export class UserService implements IUserService {
    private readonly dao: IUserDAO
    private readonly taskService: ITaskService

    constructor(userDAO: IUserDAO, taskService: ITaskService) {
        this.taskService = taskService
        this.dao = userDAO
    }

    async create(data: Partial<UserData>): Promise<UserData> {
        const validator = new UserValidator(data)
        validator.validateCreateDataOrThrow()

        return await this.dao.create(data)
    }

    async update(data: Partial<UserData>): Promise<UserData> {
        return await this.dao.update(data)
    }

    async getById(id: number): Promise<UserData | null> {
        return await this.dao.getById(id)
    }

    toCreateData(data: unknown): Partial<UserData> {
        return new User(data as Partial<UserData>).toCreateData()
    }

    async getWorkingTime(userId?: number, projectIds?: number[], startDate?: Date, endDate?: Date): Promise<WorkingTimeData> {
        const userData: Partial<UserData> = {id: userId}

        const validator = new UserValidator(userData)
        if (!validator.validateExistId()) validator.throwValidationError(ValidationType.NotFound)

        const filter: CompletedTasksFilter = {
            userId: userId,
            projectsIds: projectIds,
            startDate: startDate,
            endDate: endDate
        }

        return this.taskService.getWorkingTime(filter)
    }
}

