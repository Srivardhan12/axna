import { Request, Response } from "express";

export const quiz = (req: Request, res: Response) => {
    const body = req.body
    res.json({ body: body, message: "WORKING" })
}