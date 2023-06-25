import { Router } from "express";
import handleRefresh from "../controller/RefreshTokenController";

const router = Router();

router.get('/', handleRefresh)

export default router;