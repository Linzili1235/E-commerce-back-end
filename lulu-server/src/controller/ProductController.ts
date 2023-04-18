import {NextFunction, Request, Response} from "express"
import {Product} from "../entity/Product";
import {AppDataSource} from "../data-source"
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/Err";

export class ProductController {
    // Getter method
    public static get repo() {
        return AppDataSource.getRepository(Product)
    }
    static async all(request: Request, response: Response, next: NextFunction) {
        let products = []
        try {
            products = await ProductController.repo.find()
        }catch (e) {
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, products))
    }
    static async one(request: Request, response: Response, next: NextFunction) {
        const {productId} = request.params
        // check if product id is present in the params
        if (!productId) return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))

        let product = null
        try {
            product = await ProductController.repo.findOneOrFail({
                where: {product_real_id: productId}
            })
        }catch (e) {
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, product))
    }
    static async create(request: Request, response: Response, next: NextFunction) {
        let {productId, name, price, img, slug, color, size} = request.body
        let product = new Product()
        product.product_real_id = productId
        product.name = name
        product.price = price
        product.media = img
        product.slug = slug
        product.color = color
        product.size = size
        product.isActive = true
        console.log('new product', product)

        try{
            const errors = await validate(product)
            if(errors.length > 0) {
                let error = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return response.status(HttpCode.E400).send(error)
            }
            // save data to db
            await ProductController.repo.save(product)

        }catch(e){
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err())

    }
    static async remove(request: Request, response: Response, next: NextFunction) {

    }
    static async update(request: Request, response: Response, next: NextFunction) {
        const {productId} = request.params
        // check if product id is present in the params
        if (!productId) return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))

        // check if product is in the database
        let product = null
        try {
            product = await ProductController.repo.findOneOrFail({
                where: {product_real_id: productId}
            })
        }catch (e) {
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        // check if product has correct format
        let {name, price, media, slug, description} = request.body
        product.name = name
        product.price = price
        product.media = media
        product.slug = slug
        product.description = description

        // validate update product
        try{
            const errors = await validate(product)
            if(errors.length > 0) {
                let error = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return response.status(HttpCode.E400).send(error)
            }
            // save data to db
            await ProductController.repo.save(product)
        }catch(e){
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err())
    }
}