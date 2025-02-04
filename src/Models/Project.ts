import {ProjectData} from "../Data/Types"

export class Project {

    private readonly projectData: ProjectData

    // Пользователь отправляет запрос для создания проекта.
    // В теле запроса: название проекта и краткое описание (опционально).
    // Проект сохраняется в базе данных с привязкой к пользователю.

    // TODO: продолжить делать модель Project

    constructor(data: any) {
        this.projectData = {
            id: Number(data?.id) || 0,
            userId: Number(data?.userId) || 0,
            name: data?.name?.toString().trim() || "",
            description: data?.description?.toString().trim() || ""
        }
    }

    isValidData(): boolean {
        return true
        // return this.data.name !== "" && this.isValidEmail(this.data.email);
    }

}