import {ORM, ProjectData, ProjectWithTasks} from "../Data/Types"
import {OrmError} from "../OrmError"
import {IProjectDAO} from "./IProjectDAO"

export class ProjectDAO implements IProjectDAO {

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
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    tasks: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            assignedTo: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },
                        }
                    }
                }
            })
        } catch (error) {
            throw new OrmError(error)
        }
    }
}