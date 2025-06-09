import {ProjectData, ProjectModelDelegate, ProjectWithTasks, TaskData, TaskModelDelegate} from "../types"
import {CrudDAO} from "./crud.dao"
import {OrmError} from "../../errors/orm-error"
import {IProjectDAO} from "./project.dao.interface"

export class ProjectDAO extends CrudDAO<ProjectData, ProjectModelDelegate> implements IProjectDAO {
    constructor(model: ProjectModelDelegate) {
        super(model)
    }

    async getProjectsWithTasks(userId: number): Promise<ProjectWithTasks[]> {
        try {
            return await this.model.findMany({
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