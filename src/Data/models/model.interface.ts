import {ProjectData, TaskData, UserData} from "../types"

export interface IModel {
    toCreateData(): Partial<TaskData> | Partial<ProjectData> | Partial<UserData>
    toUpdateData(): Partial<TaskData> | Partial<ProjectData> | Partial<UserData>
    getModelName(): string
}