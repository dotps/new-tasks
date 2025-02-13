import {ProjectData, TaskData, UserData} from "../Data/Types"
import {ErrorMessages} from "./ErrorMessages"

export interface IModel {
    isValidCreateData(validationErrors: string[]): boolean
    isValidUpdateData(errors: string[]): boolean
    toCreateData(): Partial<TaskData> | Partial<ProjectData> | Partial<UserData>
    toUpdateData(): Partial<TaskData> | Partial<ProjectData> | Partial<UserData>
    getModelName(): string
}