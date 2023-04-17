import { Router } from "express";
import { UserController} from "../controller/UserController";

const router = Router();

router.get('/', UserController.all)
router.get('/oneUser', UserController.one)
router.post('/create', UserController.create)
router.post('/login', UserController.logIn)
router.put('/:userId', UserController.update)
router.delete('/:userId', UserController.remove)



export default router;