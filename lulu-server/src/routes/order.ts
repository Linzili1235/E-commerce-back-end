import { Router } from "express";
import { OrderController} from "../controller/OrderController";

const router = Router();


router.get('/', OrderController.all)
router.get('/:orderId', OrderController.one)
router.post('/', OrderController.create)
router.put('/:orderId', OrderController.update)
router.delete('/:orderId', OrderController.remove)




export default router;