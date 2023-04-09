
import "reflect-metadata"
import * as express from "express"
import * as bodyParser from "body-parser"
import { AppDataSource } from "./data-source"
import routes from "./routes"

const SERVER_PORT = 3000

AppDataSource.initialize().then(async () => {
    // create express app
    const app = express()
    // middleware: parsing HTTP request bodies,
    // request body can contain various types of data, such as JSON, XML, or form data.
    app.use(bodyParser.json())
    app.use('/', routes)
    // start express server
    app.listen(SERVER_PORT)

    console.log(`Express server has started on port ${SERVER_PORT}. Open http://localhost:${SERVER_PORT}/users to see results`)

}).catch(error => console.log(error))
