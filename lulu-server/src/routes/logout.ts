import { Router } from "express";
import handleLogout from "../controller/LogoutController";

const router = Router();

router.get('/', handleLogout)

export default router;