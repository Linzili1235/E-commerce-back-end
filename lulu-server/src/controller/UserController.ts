import {NextFunction, Request, Response} from "express"
import {User} from "../entity/User";
import {AppDataSource} from "../data-source"
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import * as path from "path";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// require('dotenv').config();  from root
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

export class UserController {
    // Getter method
    public static get repo() {
        return AppDataSource.getRepository(User)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let users = []
        try {
            users = await UserController.repo.find()
        }catch (e) {
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, users))
    }
    static async one(request: Request, response: Response, next: NextFunction) {
        const {email} = request.body
        // check if user id is present in the params
        if (!email) return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        console.log('x')
        let user = null
        try {
            user = await UserController.repo.findOneOrFail({
                where: {"email": email}
            })
        }catch (e) {
            console.error('error fetch user info',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, user))
    }
    static async create(request: Request, response: Response, next: NextFunction) {
        let {firstName, lastName, email, password} = request.body
        try{
            // what is 10? 10 is the salt round
            // It is the log2 of the number of rounds of hashing that are applied to the password
            // 10 means 2^10 = 1024 rounds of hashing.
            const hashedPassword = await bcrypt.hash(password, 10)
            let user = new User()
            user.firstName = firstName
            user.lastName = lastName
            user.email = email
            user.password = hashedPassword
            user.isStaff = false
            user.isDelete = false
            user.isActive = true

            const errors = await validate(user)

            if(errors.length > 0) {
                let error = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return response.status(HttpCode.E400).send(error)
            }
            // save data to db
            await UserController.repo.save(user)
            response.status(HttpCode.E200).json(`Success! New user: ${user.firstName} is created!`)
        }catch(e){
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(HttpCode.E200).send(new Err())
    }

    static async remove(request: Request, response: Response, next: NextFunction) {

    }
    static async update(request: Request, response: Response, next: NextFunction) {
        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK))
        // const {uuid} = request.params
        // // check if user id is present in the params
        // if (!uuid) return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        //
        // // check if user is in the database
        // let user = null
        // try {
        //     user = await UserController.repo.findOneOrFail({
        //         where: {id: Number(uuid)}
        //     })
        // }catch (e) {
        //     console.error('error write to database',e)
        //     return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        // }

        // check if user has correct format
        // let {firstName, lastName, age, email, password} = request.body
        // user.firstName = firstName
        // user.lastName = lastName
        // user.age = age
        // user.email = email
        // user.password = password
        // user.isStaff = false
        // user.isDeleted = false
        // user.isActive = true

        // validate update user
        // try{
        //     const errors = await validate(user)
        //     if(errors.length > 0) {
        //         let error = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
        //         return response.status(HttpCode.E400).send(error)
        //     }
        //     // save data to db
        //     await UserController.repo.save(user)
        // }catch(e){
        //     console.error('error write to database',e)
        //     return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        // }
        // return response.status(HttpCode.E200).send(new Err())
    }
    static async logIn(request: Request, response: Response, next: NextFunction) {
        console.log('x')
        const userEmail = request.body.email
        const pwd = request.body.password
        // check if user id is present in the params
        if (!userEmail || !pwd) return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrEmailOrPassword))

        // Authentication
        try {
            // find if user is registered already
            const user = await UserController.repo.findOneOrFail({
                where: {email: userEmail}
            })
            const match = await bcrypt.compare(pwd, user.password)
            if (match) {
                // Authorization
                // JWT token
                // in the payload, do not contain sensitive data like password

                // You can add a flag in the payload of the access token called "auth_type" to indicate whether it was
                // generated by user credentials or by a refresh token. This adds an extra layer of security and can be
                // used to authorize sensitive operations. For example, you can check the "auth_type" flag before allowing
                // a user to perform sensitive operations and prompt them to log in again if necessary.
                const accessToken = jwt.sign(
                    // When a user logs in, generate an access token with auth_type = "login"
                    {"email": user.email, "auth_type": 'login'},
                    "" + process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME})
                const refreshToken = jwt.sign(
                    {"email": user.email},
                    "" + process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME})

                // save refreshToken in the database so it can be cross-referenced
                await UserController.repo.update({email: user.email}, {refreshToken: refreshToken});
                // save refresh token in cookie with httponly and expires in one day
                // refreshToken will be saved in the Cookies
                response.cookie('jwt', refreshToken, {httpOnly:true, maxAge:24*60*60*1000})

                return response.status(HttpCode.E200).json({
                    accessToken,
                    error: new Err(HttpCode.E200, ErrStr.LoggedIn)
                });
            }
        }catch (e) {
            console.log(e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrEmailOrPassword, e))
        }
        return response.status(HttpCode.E400).send(new Err(HttpCode.E404, ErrStr.ErrEmailOrPassword))
    }

}