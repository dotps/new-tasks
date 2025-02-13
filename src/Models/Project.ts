import {ProjectData} from "../Data/Types"
import {IModel} from "./IModel"
import {ModelProps} from "./User"

export class Project implements IModel {

    id?: number
    userId?: number
    title: string
    description: string
    createdAt: Date

    constructor(data: Partial<ProjectData>) {
        if (data?.id) this.id = Number(data.id)
        if (data?.userId) this.userId = Number(data.userId)
        this.title = data?.title?.toString().trim() || ""
        this.description = data?.description?.toString().trim() || ""
        this.createdAt = data?.createdAt ? new Date(data.createdAt) : new Date()
    }

    get props(): ModelProps {
        return {
            name: "Проект",
            errorMessages: {
                titleIsRequired: "Заголовок обязателен.",
                userNotChainToProject: "Не привязан пользователь.",
            },
        }
    }

    toData(): ProjectData {
        return Object.assign({}, this) as ProjectData
    }

    isValidData(errors: string[]): boolean {
        let isValid = true

        if (!this.title) {
            isValid = false
            errors.push(this.props.errorMessages?.titleIsRequired)
        }

        if (!this.userId) {
            isValid = false
            errors.push(this.props.errorMessages.userNotChainToProject)
        }

        return isValid
    }

    isValidUpdateData(errors: string[]): boolean {
        return true
    }
}