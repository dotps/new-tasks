import {ValidationError} from "../Errors/ValidationError"
import {ResponseCode} from "../Responses/ResponseCode"

export class SimpleAccessRefreshToken {

    private static readonly tokenSeparator: string = "!"
    private static readonly accessTokenDuration: number = 60 * 60 * 1000
    private static readonly accessTokenType: string = "access-token"
    private static readonly refreshTokenDuration: number = 24 * 60 * 60 * 1000
    private static readonly refreshTokenType: string = "refresh-token"

    static generateAccessToken(id: number): string {
        const tokenParts = [
            this.accessTokenType,
            id.toString(),
            this.getExpiresTimestamp(this.accessTokenDuration).toString()
        ]
        const token = tokenParts.join(this.tokenSeparator)
        return this.encode(token)
    }

    static encode(token: string): string {
        return Buffer.from(token).toString("base64")
    }

    static decode(token: string): string {
        return Buffer.from(token).toString("utf8")
    }

    static generateRefreshToken(id: number) {
        const tokenParts = [
            this.refreshTokenType,
            id.toString(),
            this.getExpiresTimestamp(this.refreshTokenDuration).toString()
        ]
        const token = tokenParts.join(this.tokenSeparator)
        return this.encode(token)
    }

    static getExpiresTimestamp(duration: number): number {
        const expiresDate = new Date(new Date().getTime() + duration)
        return expiresDate.getTime()
    }

    // TODO: доделать токены
    static refreshAccessToken(refreshToken: string): string {
        const [tokenType, id, expiresTimestamp] = refreshToken.split(this.tokenSeparator)
        const userId = Number(id) || undefined

        if (!userId || tokenType !== this.refreshTokenType) throw new ValidationError("Неверный токен.", ResponseCode.ERROR_UNAUTHORIZED)

        if (refreshToken === this.generateRefreshToken(userId)) {
            return this.generateAccessToken(userId)
        }
        throw new ValidationError("Неверный токен.", ResponseCode.ERROR_UNAUTHORIZED)
    }
}