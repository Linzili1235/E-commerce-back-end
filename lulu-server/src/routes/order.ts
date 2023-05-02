import { Router } from "express";
import { OrderController} from "../controller/OrderController";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();


router.get('/', OrderController.all)
router.get('/:orderId', OrderController.one)
router.post('/create', OrderController.create)
router.put('/update/:orderId', OrderController.update)
router.delete('/remove/:orderId', OrderController.remove)




export default router;