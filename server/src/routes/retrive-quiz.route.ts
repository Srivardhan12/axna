import Router from "express";
import { authenticate } from "../middleware/auth.middleware";
import { retriveQuizNames, retriveUserQuizes } from "../controlers/retrive-user-quizes.controler";

const router = Router()

router.post("/retrivequiz", authenticate, retriveUserQuizes)
router.post("/retrivequiznames", authenticate, retriveQuizNames)

export default router