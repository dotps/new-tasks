import {ProjectData, UserData} from "../Data/Types"
import {IModel} from "./IModel"
import {ErrorMessages} from "./ErrorMessages"

export class Project implements IModel {

    private readonly id?: number
    private readonly userId?: number
    private readonly title?: string
    private readonly description?: string

    private modelName: string = "Пользователь"
    private errorMessages: ErrorMessages = {
        titleIsRequired: "Заголовок обязателен.",
        userNotChainToProject: "Не привязан пользователь.",
    }

    // TODO: протестировать Project User Task

    constructor(data: Partial<ProjectData>) {
        this.id = Number(data?.id) || undefined
        this.userId = Number(data?.userId) || undefined
        this.title = data?.title?.toString().trim() || undefined
        this.description = data?.description?.toString().trim() || undefined
    }

    getModelName(): string {
        return this.modelName
    }

    toCreateData(): Partial<ProjectData> {
        return {
            title: this.title,
            description: this.description,
            userId: this.userId,
        }
    }

    toUpdateData(): Partial<ProjectData> {
        return {
            ...this.toCreateData(),
            id: this.id,
        }
    }

    isValidCreateData(errors: string[]): boolean {
        let isValid = true

        if (!this.title) {
            isValid = false
            errors.push(this.errorMessages?.titleIsRequired)
        }

        if (!this.userId) {
            isValid = false
            errors.push(this.errorMessages.userNotChainToProject)
        }

        return isValid
    }

    isValidUpdateData(errors: string[]): boolean {
        return true
    }
}