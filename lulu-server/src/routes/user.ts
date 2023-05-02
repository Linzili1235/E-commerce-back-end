import { Router } from "express";
import { UserController} from "../controller/UserController";

const router = Router();

router.post('/create', UserController.create)
router.post('/login', UserController.logIn)




export default router;