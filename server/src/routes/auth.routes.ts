import { Router, Request, Response } from "express";
import { signup, signin } from "../controlers/auth.controler";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
