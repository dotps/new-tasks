import {ProjectData} from "../Data/Types"

export interface IProjectService {
    createProject(data: ProjectData): Promise<ProjectData>
}