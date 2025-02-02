export class ResponseError {
    private readonly message: string
    private readonly statusCode: number
    private readonly error: any
    private readonly timestamp: string

    constructor(message: string, statusCode: number, error?: any) {
        this.message = message
        this.statusCode = statusCode
        this.error = error
        this.timestamp = new Date().toISOString()
    }

    getStatusCode(): number {
        return this.statusCode
    }
}