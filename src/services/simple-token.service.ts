import {ITokenService} from "./token.service.interface"
import {ValidationError} from "../errors/validation-error"
import {ResponseCode} from "../responses/response-code"
import {TokenData} from "../data/token.data"

export class SimpleTokenService implements ITokenService {

    private readonly tokenSeparator: string = "!"
    private readonly accessTokenDuration: number = 360 * 24 * 60 * 60 * 1000
    private readonly accessTokenType: string = "access-token"
    private readonly refreshTokenDuration: number = 360 * 24 * 60 * 60 * 1000
    private readonly refreshTokenType: string = "refresh-token"

    generateAccessToken(id: number): string {
        return this.generateToken(id, this.accessTokenType, this.accessTokenDuration)
    }

    generateRefreshToken(id: number): string {
        return this.generateToken(id, this.refreshTokenType, this.refreshTokenDuration)
    }

    refreshAccessToken(refreshToken: string | undefined): string {
        if (!refreshToken) throw new ValidationError("Неверный токен.", ResponseCode.ErrorUnauthorized)
        const tokenData = this.getTokenData(refreshToken)
        if (tokenData.tokenType !== this.refreshTokenType) throw new ValidationError("Неверный токен.", ResponseCode.ErrorUnauthorized)
        return this.generateAccessToken(tokenData.userId)
    }

    getTokenData(token: string): TokenData {
        const nowTimestamp = new Date().getTime()
        const [tokenType, id, expires] = this.decode(token).split(this.tokenSeparator)
        let expiresTimestamp = Number(expires) || nowTimestamp
        let userId = Number(id) || undefined
        if (!userId || (tokenType !== this.accessTokenType && tokenType !== this.refreshTokenType)) throw new ValidationError("Неверный токен.", ResponseCode.ErrorUnauthorized)
        if (expiresTimestamp < nowTimestamp) throw new ValidationError("Срок действия токена завершен.", ResponseCode.ErrorUnauthorized)

        return {
            tokenType: tokenType,
            userId: userId,
            expiresTimestamp: expiresTimestamp
        }
    }

    private generateToken(id: number, tokenType: string, duration: number): string {
        const tokenData: TokenData = {
            tokenType: tokenType,
            userId: id,
            expiresTimestamp: this.getExpiresTimestamp(duration)
        }
        const token = Object.values(tokenData).join(this.tokenSeparator)
        return this.encode(token)
    }

    private encode(token: string): string {
        return Buffer.from(token).toString("base64")
    }

    private decode(token: string): string {
        return Buffer.from(token, "base64").toString("utf8")
    }

    private getExpiresTimestamp(duration: number): number {
        const expiresDate = new Date(new Date().getTime() + duration)
        return expiresDate.getTime()
    }
}

