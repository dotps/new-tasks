import {UserData} from "../Data/Types"
import {Token} from "../Token"

export class Project {

    private readonly projectData: ProjectData

    // Пользователь отправляет запрос для создания проекта.
    // В теле запроса: название проекта и краткое описание (опционально).
    // Проект сохраняется в базе данных с привязкой к пользователю.

    // TODO: продолжить делать модель Project

    constructor(data: any) {
        this.projectData = {
            userId: Number(data?.user_id) || 0,
            title: data?.title?.toString().trim() || "",
            description: data?.description?.toString().trim() || ""
        }
    }

    get data(): ProjectData {
        return this.projectData
    }

    isValidData(): boolean {
        return true
        // return this.data.name !== "" && this.isValidEmail(this.data.email);
    }

}