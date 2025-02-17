import {ORM, ProjectData, ProjectWithTasks} from "../Data/Types"
import {IProjectService} from "./IProjectService"
import {OrmError} from "../OrmError"

export class ProjectService implements IProjectService {

    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async create(data: Partial<ProjectData>): Promise<ProjectData> {
        try {
            return await this.orm.project.create({
                data: data as ProjectData
            })
        } catch (error) {
            throw new OrmError(error)
        }
    }

    async update(data: Partial<ProjectData>): Promise<ProjectData> {
        try {
            return await this.orm.project.update({
                where: {
                    id: data.id
                },
                data: data as ProjectData
            })
        } catch (error) {
            throw new OrmError(error)
        }
    }

    async getProjectsWithTasks(userId: number): Promise<ProjectWithTasks[]> {
        try {
            return await this.orm.project.findMany({
                where: {
                    userId: userId,
                    // id: 1,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    tasks: {
                        select: {
                            title: true,
                            description: true,
                        }
                    }
                }
            })
        } catch (error) {
            throw new OrmError(error)
        }
    }
}