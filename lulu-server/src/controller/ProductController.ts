import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"

export class ProductController {

    static async all(request: Request, response: Response, next: NextFunction) {
        return response.send('get all products')
    }
    static async one(request: Request, response: Response, next: NextFunction) {
        const {productId} = request.params
        return response.send('get one product ' + productId)
    }
    static async create(request: Request, response: Response, next: NextFunction) {
    }
    static async remove(request: Request, response: Response, next: NextFunction) {
    }
    static async update(request: Request, response: Response, next: NextFunction) {
    }
}