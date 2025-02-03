import {ORM, UserData} from "../Data/Types"
import {User} from "../Models/User"

export class TaskService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async createProject(userData: UserData): Promise<null>  {
        // const name = userData.name
        // const email = userData.email
        //
        // userData = await this.orm.user.create({
        //     data: {name, email}
        // })

        // return new User(userData)
        return null
    }

    async createTask(userData: UserData): Promise<null>  {
        return null
    }
}

