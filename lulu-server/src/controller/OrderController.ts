import {NextFunction, Request, Response} from "express"
import {AppDataSource} from "../data-source";
import {Order} from "../entity/Order";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {validate} from "class-validator";
import {CheckController, IdCheckRes} from "./CheckController";
import { UserController } from "./UserController";
import {ProductController} from "./ProductController";

//CRUD

export class OrderController extends CheckController{

    // Getter method
    public static get repo() {
        return AppDataSource.getRepository(Order)
    }
    static async all(request: Request, response: Response, next: NextFunction) {
        let orders = []
        try {
            orders = await OrderController.repo.find()
        }catch (e) {
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, orders))
    }
    static async one(request: Request, response: Response, next: NextFunction) {
        const {orderId} = request.params
        // check if order id is present in the params
        if (!orderId) return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))

        let order = null
        try {
            order = await OrderController.repo.findOneOrFail({
                where: {order_id: Number(orderId)}
            })
        }catch (e) {
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, order))
    }
    static async create(request: Request, response: Response, next: NextFunction) {
        let {total, taxRate, user, products} = request.body
        let order = new Order()
        order.total = total
        // user 传进来是id，我们需要object   --- object
        // products 传进来是多个id，我们需要一个 []  --- array
        try{
            const errors = await validate(order)
            if(errors.length > 0) {
                let error = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                console.log(error)
                return response.status(HttpCode.E400).send(error)
            }

            // User id 验证
            // Products array id 验证
            // 封装函数 (validateOrder)
            let res = await OrderController.validateOrder(user, products)
            order.user = res[0].entities[0]
            order.products = res[1].entities

            await OrderController.repo.save(order)

        }catch(e){
            console.error('error write to database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, order))

    }
    // 返回对应的obj
    static async validateOrder (user: number, products: number[]) {
        //check items in products array are all number type
        const areAllNumber = products.every((product) => typeof product === 'number')

        if(typeof user !== 'number' || user <= 0 || !Array.isArray(products) || !areAllNumber) {
            throw (new Err(HttpCode.E400,  ErrStr.ErrInvalid))
        }

        // 现在需要找到product array里面number所对应的obj
        // 建立一个 CheckController
        let res: IdCheckRes[] = []
            // Check user
        let tempUser = await OrderController.checkIdExists([user], UserController.repo)
        if (tempUser.index !== -1) {
            throw (new Err(HttpCode.E400, 'Invalid user id, ' + tempUser.index))
        }
        res.push(tempUser)
        // Check products
        console.log('order controller',products)
        let tempProduct = await OrderController.checkIdExists(products, ProductController.repo)
        if (tempProduct.index !== -1) {
            throw (new Err(HttpCode.E400, 'Invalid products, ' + tempProduct.index))
        }
        res.push(tempProduct)

        return res

    }
    static async remove(request: Request, response: Response, next: NextFunction) {
    }
    static async update(request: Request, response: Response, next: NextFunction) {
    }
}