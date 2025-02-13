import {ProjectData, TaskData, UserData} from "../Data/Types"
import {ModelProps} from "./User"

export interface IModel {
    isValidCreateData(validationErrors: string[]): boolean
    // isValidUpdateData<TData>(data: TData, errors: string[]): boolean
    isValidUpdateData(errors: string[]): boolean
    // toData(): TaskData | ProjectData | UserData
    toCreateData(): Partial<TaskData> | Partial<ProjectData> | Partial<UserData>
    toUpdateData(): Partial<TaskData> | Partial<ProjectData> | Partial<UserData>
    // get props(): ModelProps
    getName(): string
}