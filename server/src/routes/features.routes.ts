import Router from "express";
import { quiz } from "../controlers/features.controler";
import { upload } from "../middleware/upload.middleware";

const router = Router()

router.post("/quiz", upload.single("pdf"), quiz)

export default router