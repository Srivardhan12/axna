import Router from "express";
import { quiz, quizopt } from "../controlers/features.controler";
import { upload } from "../middleware/upload.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router()

router.post("/quiz", authenticate, upload.single("pdf"), quiz)
router.post("/quizopt", authenticate, upload.single("pdf"), quizopt)

export default router