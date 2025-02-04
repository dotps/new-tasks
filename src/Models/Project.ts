import {ProjectData} from "../Data/Types"

export class Project {

    private readonly projectData: ProjectData

    // Пользователь отправляет запрос для создания проекта.
    // В теле запроса: название проекта и краткое описание (опционально).
    // Проект сохраняется в базе данных с привязкой к пользователю.

    // TODO: продолжить делать модель Project

    constructor(data: any) {
        this.projectData = {
            userId: Number(data?.userId) || 0,
            title: data?.title?.toString().trim() || "",
            description: data?.description?.toString().trim() || ""
        }
    }

    private set data(value: ProjectData) {
        this.projectData = value
    }

    isValidData(): boolean {
        return true
        // return this.data.name !== "" && this.isValidEmail(this.data.email);
    }

}