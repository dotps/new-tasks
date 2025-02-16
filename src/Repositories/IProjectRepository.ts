import {ProjectData} from "../Data/Types"

export interface IProjectRepository {
    create(data: ProjectData): Promise<ProjectData>
    update(data: ProjectData): Promise<ProjectData>
}