import {ORM, ProjectData} from "../Data/Types"
import {IProjectService} from "./IProjectService"
import {OrmError} from "../OrmError"
import {ResponseCode} from "../ResponseCode"

export class ProjectService implements IProjectService {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async create(data: ProjectData): Promise<ProjectData> {
        try {
            return await this.orm.project.create({
                data: data
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }

    async update(data: ProjectData): Promise<ProjectData> {
        try {
            return this.orm.project.update({
                where: {
                    id: data.id
                },
                data: data
            })
        }
        catch (error) {
            throw new OrmError(error)
        }
    }
}