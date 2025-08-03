import Router from "express";
import { quiz } from "../controlers/features.controler";
import { upload } from "../middleware/upload.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router()

router.post("/quiz", authenticate, upload.single("file"), quiz)

export default router