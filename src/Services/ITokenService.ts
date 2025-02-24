import {TokenData} from "../Data/TokenData"

export interface ITokenService {
    generateAccessToken(id: number): string
    generateRefreshToken(id: number): string
    getTokenData(token: string): TokenData
    refreshAccessToken(refreshToken: string | undefined): string
}