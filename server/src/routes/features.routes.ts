import Router from "express";
import { quiz } from "../controlers/features.controler";

const router = Router()

router.post("/quiz", quiz)

export default router