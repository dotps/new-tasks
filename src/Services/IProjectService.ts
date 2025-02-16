import {ProjectData} from "../Data/Types"

export interface IProjectService {
    create(data: ProjectData): Promise<ProjectData>
    update(data: ProjectData): Promise<ProjectData>
}