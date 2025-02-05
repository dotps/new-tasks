import {ProjectData} from "../Data/Types"

export class Project {

    id?: number
    userId?: number
    title: string
    description: string
    createdAt: Date

    constructor(data: Partial<ProjectData>) {
        if (data?.id) this.id = Number(data?.id)
        if (data?.userId) this.userId = Number(data?.userId)
        this.title = data?.title?.toString().trim() || ""
        this.description = data?.description?.toString().trim() || ""
        this.createdAt = data?.createdAt || new Date()
    }

    toData(): ProjectData {
        return Object.assign({}, this) as ProjectData
    }

    isValidData(errors: string[]): boolean {
        let isValid = true

        if (!this.title) {
            isValid = false
            errors.push("Заголовок обязателен.")
        }

        if (!this.userId) {
            isValid = false
            errors.push("Не привязан пользователь.")
        }

        return isValid
    }
}