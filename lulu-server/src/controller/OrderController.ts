
// router.post('/', (req, res) => {
//     const {orderId} = req.params
//     return res.send(`...return results from orderId ${orderId}`)
// })

// 返回给前段一个object，并且也可以更改header
// router.get('/:userName', (req, res) => {
//     const {userName} = req.params
//     let userInfo = {
//         name: userName,
//         address: 'Toronto',
//         products: [
//             {
//                 Id: '1'
//             },
//             {
//                 Id: '2'
//             }
//         ]
//     }
//     res.setHeader('Content-Type','application/json')
//     res.setHeader('X-Powered-By', 'Lulu-team')
//     // 要返回json格式
//     // - res.status(222)
//     // - res.redirect('https//mark2win.com')
//     return res.send(userInfo)
// })

import { NextFunction, Request, Response } from "express"

//CRUD

export class OrderController {

    static async all(request: Request, response: Response, next: NextFunction) {
        return response.send('get all orders')
    }
    static async one(request: Request, response: Response, next: NextFunction) {
        const {orderId} = request.params
        return response.send('get one orders ' + orderId)
    }
    static async create(request: Request, response: Response, next: NextFunction) {
    }
    static async remove(request: Request, response: Response, next: NextFunction) {
    }
    static async update(request: Request, response: Response, next: NextFunction) {
    }
}