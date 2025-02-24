import {UserData} from "./Types"
import {ITokenService} from "../Services/ITokenService"
import {AuthData} from "./AuthData"

export class AuthDataGenerator {

    private userData: UserData
    private tokenService: ITokenService

    constructor(userData: UserData, tokenService: ITokenService) {
        this.userData = userData
        this.tokenService = tokenService
    }

    toData(): AuthData {
        const userId = this.userData.id || 0
        return {
            id: userId,
            accessToken: this.tokenService.generateAccessToken(userId),
            refreshToken: this.tokenService.generateRefreshToken(userId)
        }
    }
}