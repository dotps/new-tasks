import {ValidationError} from "../Errors/ValidationError"
import {ResponseCode} from "../Responses/ResponseCode"

export class AccessRefreshToken {

    private static readonly tokenSeparator: string = "!"
    private static readonly accessTokenDuration: number = 60 * 60 * 1000
    private static readonly refreshTokenDuration: number = 24 * 60 * 60 * 1000

    static generateAccessToken(id: number): string {
        return "access-token!" + id + "!" + this.getExpiresTimestamp(this.accessTokenDuration)
    }

    static generateRefreshToken(id: number) {
        return "refresh-token!" + id + "!" + this.getExpiresTimestamp(this.refreshTokenDuration)
    }

    static getExpiresTimestamp(duration: number): number {
        const expiresDate = new Date(new Date().getTime() + duration)
        return expiresDate.getTime()
    }

    // TODO: доделать токены
    static refreshAccessToken(token: string): string {
        const [tokenType, id, expiresTimestamp] = token.split(this.tokenSeparator)
        const userId = Number(id) || undefined

        if (!userId) throw new ValidationError("Неверный токен.", ResponseCode.ERROR_UNAUTHORIZED)

        if (token === this.generateRefreshToken(userId)) {
            return this.generateAccessToken(userId)
        }
        throw new ValidationError("Неверный токен.", ResponseCode.ERROR_UNAUTHORIZED)
    }
}