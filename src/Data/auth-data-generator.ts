import {UserData} from "./types"
import {ITokenService} from "../services/token.service.interface"
import {AuthData} from "./auth.data"

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