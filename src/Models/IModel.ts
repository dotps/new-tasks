import {ProjectData, TaskData, UserData} from "../Data/Types"
import {ModelProps} from "./User"

export interface IModel {
    isValidData(validationErrors: string[]): boolean
    toData(): TaskData | ProjectData | UserData
    get props(): ModelProps
}