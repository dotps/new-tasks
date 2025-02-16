import {ORM, ProjectData} from "../Data/Types"
import {IProjectRepository} from "./IProjectRepository"

export class ProjectRepository implements IProjectRepository {
    private orm: ORM

    constructor(orm: ORM) {
        this.orm = orm
    }

    async create(data: ProjectData): Promise<ProjectData> {
        return this.orm.project.create({
            data: data
        })
    }

    async update(data: ProjectData): Promise<ProjectData> {
        return this.orm.project.update({
            where: {
                id: data.id
            },
            data: data
        })
    }
}