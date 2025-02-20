import {ErrorMessages} from "../Models/ErrorMessages"
import {ProjectData, ValidationType} from "../Data/Types"
import {Validator} from "./Validator"

export class ProjectValidator extends Validator<ProjectData> {
    override readonly title: string = "Проект"
    override readonly errorMessages: ErrorMessages = {
        titleIsRequired: "Заголовок обязателен.",
        userNotChainToProject: "Не привязан пользователь.",
    }

    constructor(data: Partial<ProjectData> | null) {
        super(data)
    }

    validateCreateDataOrThrow(): void {
        if (!this.data.title) this.errors.push(this.errorMessages?.titleIsRequired)
        if (!this.data.userId) this.errors.push(this.errorMessages.userNotChainToProject)
        this.throwValidationError(ValidationType.CREATE)
    }
}