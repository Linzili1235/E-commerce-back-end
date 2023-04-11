import {NextFunction, Request, Response} from "express"
import {User} from "../entity/User";
import {AppDataSource} from "../data-source"
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/Err";

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
        const {userId} = request.params
        // check if user id is present in the params
        if (!userId) return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))

        let user = null
        try {
            user = await UserController.repo.findOneOrFail({
                where: {id: Number(userId)}
            })
        }catch (e) {
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, user))
    }
    static async create(request: Request, response: Response, next: NextFunction) {
        let {firstName, lastName, age, email, password} = request.body
        let user = new User()
        user.firstName = firstName
        user.lastName = lastName
        user.age = age
        user.email = email
        user.password = password
        user.isStaff = false
        user.isDelete = false
        user.isActive = true

        // console.log('new user', user)

        try{
            const errors = await validate(user)
            if(errors.length > 0) {
                let error = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return response.status(HttpCode.E400).send(error)
            }
            // save data to db
            await UserController.repo.save(user)

        }catch(e){
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err())

    }
    static async remove(request: Request, response: Response, next: NextFunction) {

    }
    static async update(request: Request, response: Response, next: NextFunction) {
        const {userId} = request.params
        // check if user id is present in the params
        if (!userId) return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))

        // check if user is in the database
        let user = null
        try {
            user = await UserController.repo.findOneOrFail({
                where: {id: Number(userId)}
            })
        }catch (e) {
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        // check if user has correct format
        let {firstName, lastName, age, email, password} = request.body
        user.firstName = firstName
        user.lastName = lastName
        user.age = age
        user.email = email
        user.password = password
        user.isStaff = false
        user.isDeleted = false
        user.isActive = true

        // validate update user
        try{
            const errors = await validate(user)
            if(errors.length > 0) {
                let error = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return response.status(HttpCode.E400).send(error)
            }
            // save data to db
            await UserController.repo.save(user)
        }catch(e){
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err())
    }
}