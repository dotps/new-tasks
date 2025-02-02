import {UserData} from "./Types"

export class User {

    private readonly userData: UserData

    constructor(data: any) {
        this.userData = {
            id: Number(data?.id) || 0,
            name: data?.name?.toString() || "",
            email: data?.email?.toString() || ""
        }
    }

    get data(): UserData {
        return this.userData
    }

}