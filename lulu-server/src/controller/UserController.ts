import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"

export class UserController {

    static async all(request: Request, response: Response, next: NextFunction) {
        return response.send('get all users')
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {userId} = request.params
        return response.send('get one user ' + userId)
    }

    static async create(request: Request, response: Response, next: NextFunction) {
    }
    static async update(request: Request, response: Response, next: NextFunction) {
    }
    static async remove(request: Request, response: Response, next: NextFunction) {
    }

}