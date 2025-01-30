import express, {Application} from 'express'

export class App {
    private app: Application

    constructor() {
        this.app = express()
        this.app.use(express.json())
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Сервер запущен, порт: ${port}`)
        })
    }
}

