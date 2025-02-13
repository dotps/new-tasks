import {ProjectData, TaskData, UserData} from "../Data/Types"
import {ModelProps} from "./User"

export interface IModel {
    isValidData(validationErrors: string[]): boolean
    // isValidUpdateData<TData>(data: TData, errors: string[]): boolean
    isValidUpdateData(errors: string[]): boolean
    toData(): TaskData | ProjectData | UserData
    get props(): ModelProps
}