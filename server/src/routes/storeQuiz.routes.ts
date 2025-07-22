import Router from "express";

import { authenticate } from "../middleware/auth.middleware";
import { saveQuizResult } from "../controlers/store-quiz.controler";

const router = Router()

router.post("/storequiz", authenticate, saveQuizResult)

export default router