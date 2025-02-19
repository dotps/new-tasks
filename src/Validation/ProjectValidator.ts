import {ErrorMessages} from "../Models/ErrorMessages"
import {IEntityValidator} from "./IEntityValidator"
import {Project} from "../Models/Project"
import {ProjectData} from "../Data/Types"
import {ValidationError} from "../ValidationError"

export class ProjectValidator implements IEntityValidator {
    model: Project
    private errorMessages: ErrorMessages = {
        titleIsRequired: "Заголовок обязателен.",
        userNotChainToProject: "Не привязан пользователь.",
    }

    constructor(model: Project) {
        this.model = model
    }

    isValidCreateData(): boolean {
        const errors: string[] = []
        const data: Partial<ProjectData> = this.model.toCreateData()
        let isValid = true

        if (!data.title) {
            isValid = false
            errors.push(this.errorMessages?.titleIsRequired)
        }

        if (!data.userId) {
            isValid = false
            errors.push(this.errorMessages.userNotChainToProject)
        }

        if (!isValid) {
            ValidationError.CreateData(this.model.getModelName(), errors)
        }

        return isValid
    }

    isValidUpdateData(): boolean {
        return true
    }
}