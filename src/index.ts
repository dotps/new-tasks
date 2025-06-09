import {App} from "./app"

const app = new App()
const port = Number(process.env.APP_PORT)

app.start(port)