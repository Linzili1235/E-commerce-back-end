import {NextFunction, Request, Response} from "express"
import {AppDataSource} from "../data-source";
import {Order} from "../entity/Order";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {validate} from "class-validator";
import {CheckController, IdCheckRes} from "./CheckController";
import { UserController } from "./UserController";
import {ProductController} from "./ProductController";
import {OrderProduct} from "../entity/OrderProduct";

//CRUD

export class OrderController extends CheckController{

    // Getter method
    public static get repo() {
        return AppDataSource.getRepository(Order)
    }
    public static get odProductRepo() {
        return AppDataSource.getRepository(OrderProduct)
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
        let {total, payment, shippingAddress, user, products} = request.body

        let order = new Order()
        order.total = total
        order.orderProducts = products
        order.payment = payment
        order.shippingAddress = shippingAddress
        // user 传进来是id，我们需要object   --- object
        // products 传进来是多个id，我们需要一个 []  --- array
        try{
            const errors = await validate(order)
            if(errors.length > 0) {
                let error = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                console.log(error)
                return response.status(HttpCode.E400).send(error)
            }

            // User id verification
            // Products array id verification
            // encapsulation (validateOrder)
            let res = await OrderController.validateOrder(user, products)
            order.user = res[0].entities[0]
            order.orderProducts = res[1].entities
            // await OrderController.repo.save(order)

            // The reason why await OrderController.repo.save(order) cannot save all the orderProducts is because
            // orderProducts is a related entity to Order through the orderProducts property, and as such, it needs to be saved separately.

            for (const product of order.orderProducts) {
                const orderProduct = new OrderProduct();
                orderProduct.order_product_id = product.order_product_id
                orderProduct.quantity = product.quantity;
                orderProduct.price = product.price;
                await OrderController.odProductRepo.save(orderProduct);
            }

            await OrderController.repo.save(order)
        }catch(e){
            console.error('error write to database',e)
            return response
                .status(HttpCode.E400)
                .send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, order))

    }

    static async validateOrder (user: number, products: number[]) {
        //check items in products array are all number type
        if( user <= 0 || !Array.isArray(products)) {
            throw (new Err(HttpCode.E400,  ErrStr.ErrInvalid))
        }

        let res: IdCheckRes[] = []
            // Check user
        let tempUser = await OrderController.checkIdExists([user], UserController.repo, 'user_id')
        if (tempUser.index !== -1) {
            throw (new Err(HttpCode.E400, 'Invalid user id, ' + tempUser.index))
        }
        res.push(tempUser)
        // Check products
        let tempProduct = await OrderController.checkIdExists(products, ProductController.repo, 'product_id')
        console.log(tempProduct.index)
        if (tempProduct.index !== -1) {
            throw (new Err(HttpCode.E400, 'Invalid products, ' + tempProduct.index))
        }
        res.push(tempProduct)

        return res

    }

    // Remove an order by ID
    static async remove(request: Request, response: Response, next: NextFunction) {
            // Get the order ID from the request params
            const { orderId } = request.params;

            // Check if the order ID is present
            if (!orderId) {
                return response
                    .status(HttpCode.E400)
                    .send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter));
            }

            try {
                // Find the order with the specified ID
                const order = await OrderController.repo.findOneOrFail({
                    where: { order_id: Number(orderId) },
                });

                // Delete the order from the database
                await OrderController.repo.remove(order);

                // Send a success response
                return response
                    .status(HttpCode.E200)
                    .send(new Err(HttpCode.E200, ErrStr.OK, `Order ${orderId} successfully deleted.`));
            } catch (e) {
                console.error("Error deleting order", e);

                // Send an error response
                return response
                    .status(HttpCode.E400)
                    .send(new Err(HttpCode.E400, ErrStr.ErrStore, e));
            }
        }

    static async update(request: Request, response: Response, next: NextFunction) {
        const {orderId} = request.params

        if (!orderId) {
            return response
                .status(HttpCode.E400)
                .send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }

        try {
            const order = await OrderController.repo.findOneOrFail({
                where: { order_id: Number(orderId)}
            })
            const {total, payment, shippingAddress, products} = request.body
            order.total = total
            order.payment = payment
            order.shippingAddress = shippingAddress
            order.orderProducts = products

            // Validate the updated order object
            const errors = await validate(order);
            if (errors.length > 0) {
                console.error("Validation errors", errors);
                return response
                    .status(HttpCode.E400)
                    .send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter));
            }

            // Update the order from the database
            await OrderController.repo.save(order);

            return response
                .status(HttpCode.E200)
                .send(new Err(HttpCode.E200, ErrStr.OK, `Order ${orderId} successfully updated.`));
        }catch (e) {
            return response
                .status(HttpCode.E400)
                .send(new Err(HttpCode.E400, ErrStr.ErrInvalid))
        }

    }
}