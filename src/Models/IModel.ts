import {ProjectData, TaskData, UserData} from "../Data/Types"

export interface IModel {
    isValidData(validationErrors: string[]): boolean
    toData(): TaskData | ProjectData | UserData
}