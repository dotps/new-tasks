import {UserData} from "../Data/Types"
import {Token} from "../Token"

export class User {

    private readonly userData: UserData

    constructor(data: any) {
        this.userData = {
            id: Number(data?.id) || 0,
            name: data?.name?.toString().trim() || "",
            email: data?.email?.toString().trim() || ""
        }
    }

    get data(): UserData {
        return this.userData
    }

    getToken(): string {
        return Token.generate(this.data.id)
    }

    isValidData(): boolean {
        return this.data.name !== "" && this.isValidEmail(this.data.email);
    }

    private isValidEmail(email: string): boolean {
        if (!email) return false
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }
}