import {ProjectData} from "../Data/Types"

export class Project {

    private readonly projectData: ProjectData

    constructor(data: any) {
        this.projectData = {
            id: Number(data?.id) || 0,
            userId: Number(data?.userId) || 0,
            title: data?.title?.toString().trim() || "",
            description: data?.description?.toString().trim() || "",
            createdAt: data?.createdAt || new Date()
        }
    }

    get data(): ProjectData {
        return this.projectData
    }

    isValidData(errors: string[]): boolean {
        let isValid = true

        if (!this.data.title) {
            isValid = false
            errors.push("Заголовок обязателен.")
        }

        if (!this.data.userId) {
            isValid = false
            errors.push("Не привязан пользователь.")
        }

        return isValid
    }

}