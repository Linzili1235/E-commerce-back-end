import {NextFunction, Request, Response} from "express"
import {AppDataSource} from "../data-source";
import {Order} from "../entity/Order";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {validate} from "class-validator";
import {CheckController, IdCheckRes} from "./CheckController";
import {UserController} from "./UserController";
import {ProductController} from "./ProductController";
import {OrderProduct} from "../entity/OrderProduct";
import {v4 as uuidv4} from "uuid";
import product from "../routes/product";

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
        const {orderNumber} = request.query
        // check if order id is present in the params
        if (!orderNumber) return response.status(HttpCode.E403).send(new Err(HttpCode.E403, ErrStr.ErrMissingParameter))

        let order = null
        const results = Object()
        try {
            order = await OrderController.repo.findOneOrFail({
                where: {orderNumber}
            })
            const orderProducts = await OrderController.odProductRepo.find({
                relations: ["product"],
                where: {order: order}})
            const quantities = orderProducts.map((orderProduct) => orderProduct.quantity)
            const products = orderProducts.map((orderProduct) => orderProduct.product);
            results.quantity = quantities
            results.product = products


        }catch (e) {
            console.error('error find data in the database',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrNoObj, e))
        }
        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK,results))
    }
    static async create(request: Request, response: Response, next: NextFunction) {
        let {total, payment, shippingAddress, user, products, quantity} = request.body

        let order = new Order()
        order.total = total
        order.orderProducts = products
        order.payment = payment
        order.shippingAddress = shippingAddress
        order.orderNumber = `TXN-${uuidv4()}`
        const data = {orderNumber: order.orderNumber}


        // user 传进来是id，我们需要object   --- object
        // products 传进来是多个id，我们需要一个 []  --- array
        try{
            const errors = await validate(order)
            if(errors.length > 0) {
                let error = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return response.status(HttpCode.E400).send(error)
            }

            // User id verification
            // Products array id verification
            // encapsulation (validateOrder)

            let res = await OrderController.validateOrder(user, products)

            order.user = res[0].entities[0]
            order.orderProducts = res[1].entities
            // You can generate and assign the transaction number in the entity constructor or before saving

            // await OrderController.repo.save(order)

            // order must be saved before used as orderProduct.order = order
            await OrderController.repo.save(order)
            // The reason why await OrderController.repo.save(order) cannot save all the orderProducts is because
            // orderProducts is a related entity to Order through the
            // orderProducts property, and as such, it needs to be saved separately.
            for (const product of order.orderProducts) {
                const orderProduct = new OrderProduct();
                orderProduct.quantity = quantity.shift();
                orderProduct.price = product.price;
                orderProduct.order = order
                orderProduct.product = product
                await OrderController.odProductRepo.save(orderProduct);
            }

        }catch(e){
            console.error('error write to database',e)
            return response
                .status(HttpCode.E400)
                .send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        // if successfully, send the order uuid for future use (like invoice)
        return response.status(HttpCode.E200).json(data)

    }

    static async validateOrder (user: number, products: number[]) {
        //check items in products array are all number type
        if( user <= 0 || !Array.isArray(products)) {
            throw (new Err(HttpCode.E400,  ErrStr.ErrInvalid))
        }

        let res: IdCheckRes[] = []
            // Check user
        let tempUser = await OrderController.checkIdExists([user], UserController.repo, 'email')
        if (tempUser.index !== -1) {
            throw (new Err(HttpCode.E400, 'Invalid user id, ' + tempUser.index))
        }
        res.push(tempUser)
        // Check products
        let tempProduct = await OrderController.checkIdExists(products, ProductController.repo, 'slug')
        if (tempProduct.index !== -1) {
            throw (new Err(HttpCode.E400, 'Invalid products, ' + tempProduct.index))
        }
        res.push(tempProduct)

        return res

    }

    static async createInvoice(request: Request, response: Response, next: NextFunction){
        const {orderNumber} = request.query
        const err = await OrderController.findInvoiceInfo(orderNumber)
        if (err.code !== 200) {
            return response.send(err)
        }
        const {user, quantity, product} = err.data

        let invoicePDF = null
        try {
            const stripe = require("stripe")("sk_test_51N7UPaC2hWhUcMApaWUUt3nsUQnVUyRWqYqVu75retf1vZqGZMavWMY9fbcWEELP2OVjt3Sc3mme6PcjT02xqTMK00iDdTw2ZS")
            // if email exist, directly using existing customer
            let customer = await stripe.customers.list({email: user.email})
            if (customer.data.length === 0) {
                customer = await stripe.customers.create({email: user.email})
            } else {
                customer = customer.data[0]
            }
            const invoice = await stripe.invoices.create({
                customer: customer.id,
                collection_method: "send_invoice",
                days_until_due: 30,
            })

            for (const pro of product) {
                const updatedPrice = pro.price.split("-")[0]
                // two digits is default in stripe price
                const numericValue = parseFloat(updatedPrice.replace(/[^0-9.]/g, ''))*100;
                const prod = await stripe.products.create({
                    name: pro.name,
                });

                const price = await stripe.prices.create({
                    product: prod.id,
                    unit_amount: numericValue,
                    currency: "USD"
                });
                await stripe.invoiceItems.create({
                    invoice: invoice.id,
                    customer: customer.id,
                    price: price.id,
                    quantity: quantity.shift(),
                    description: pro.name,
                    metadata: {
                        color: pro.color,
                        size: pro.size,
                    }
                })
            }
            invoicePDF = await stripe.invoices.finalizeInvoice(invoice.id)




        } catch (e) {
            console.log(e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrInvoice, e))
        }

        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, invoicePDF.invoice_pdf))
}

    static async findInvoiceInfo(orderNumber: string) {
        // check if order id is present in the params
        if (!orderNumber) return new Err(HttpCode.E400, ErrStr.ErrMissingParameter)

        let order = null
        const info = Object()

        try {
            // check if order exists
            order = await OrderController.repo.findOneOrFail({
                where: {orderNumber}
            })
            const orderProducts = await OrderController.odProductRepo.find({
                relations: ["product"],
                where: {order: order}})

            const orderUser = await OrderController.repo.findOneOrFail({
                relations: ["user"],
                where: {orderNumber}
            })
            const user = orderUser.user
            const quantities = orderProducts.map((orderProduct) => orderProduct.quantity)
            const products = orderProducts.map((orderProduct) => orderProduct.product)
            info.user = user
            info.quantity = quantities
            info.product = products


        }catch (e) {
            console.error('error find user or products in the database',e)
            return new Err(HttpCode.E400, ErrStr.ErrNoObj, e)
        }


        return new Err(HttpCode.E200, ErrStr.OK, info)


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

                // Don't actually delete the data as it's valuable.
                order.isDelete = true
                // Update the order from the database
                await OrderController.repo.save(order);

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