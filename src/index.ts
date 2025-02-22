import {App} from "./App"

const app = new App()
const port = Number(process.env.APP_PORT)

app.start(port)