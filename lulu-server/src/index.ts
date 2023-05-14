
import "reflect-metadata"
import express from "express"
import { AppDataSource } from "./data-source"
import verifyJWT from "./middleware/verifyJWT";
import product from "./routes/product";
import user from "./routes/user";
import refresh from "./routes/refresh";
import order from "./routes/order";
import logout from "./routes/logout";
import corsOptions from "./config/corsOptions";
import credentials from "./middleware/credentials";
import cors from 'cors';
import {UserController} from "./controller/UserController";
import router from "./routes/user";
import verifyJWTAuthType from "./middleware/verifyJWTAuthType";

const SERVER_PORT = 8000;
const cookieParser = require("cookie-parser");

AppDataSource.initialize().then(async () => {
    // create express app
    const app = express()

    // handle options credentials check - before CORS
    // and fetch cookies credentials requirement
    app.use(credentials)
    // Cross-origin resource sharing
    app.use(cors())
    // middleware: parsing HTTP request bodies,
    // request body can contain various types of data, such as JSON, XML, or form data.
    app.use(express.json())

    // build-in middleware to handle urlencoded form data
    app.use(express.urlencoded({extended:false}))

    // middleware for cookies
    app.use(cookieParser())

    // unprotected routes
    app.use('/product', product)
    app.use('/user', user)

    // refresh route before verifyJWT
    app.use('/refresh', refresh)
    // logout route
    app.use('/logout', logout)

    // protected routes
    app.use(verifyJWT)
    app.use('/order', order)
    app.use('/user/oneUser', UserController.one)
    // verify jwt auth_type for more sensitive information
    app.use(verifyJWTAuthType)
    app.use('/user/update', UserController.update) // auth_type must be logIn to change the password or delete
    app.use('/user/remove', UserController.remove)

    // start express server
    app.listen(SERVER_PORT)

    console.log(`Express server has started on port ${SERVER_PORT}. Open http://localhost:${SERVER_PORT} to see results`)

}).catch(error => console.log(error))
