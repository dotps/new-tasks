import {ProjectData} from "../Data/Types"

export interface IProjectService {
    create(data: Partial<ProjectData>): Promise<ProjectData>
    update(data: Partial<ProjectData>): Promise<ProjectData>
}