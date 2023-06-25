import { Router } from "express";
import order from './order';
import product from "./product";
import user from "./user";

const routes = Router();

routes.use('/order', order)
routes.use('/product', product)
routes.use('/user', user)

export default routes;