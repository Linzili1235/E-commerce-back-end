import { Router } from "express";
import { ProductController} from "../controller/ProductController";


const router = Router();

router.get('/', ProductController.all)
router.get('/:productId', ProductController.one)
router.post('/', ProductController.create)
router.put('/:productId', ProductController.update)
router.delete('/:productId', ProductController.remove)




export default router;