export class ResponseError {
    private message: string
    private statusCode: number
    private context: any

    constructor(message: string, statusCode: number, context?: any) {
        this.message = message
        this.statusCode = statusCode
        this.context = context
    }

    getStatusCode() {
        return this.statusCode
    }

}