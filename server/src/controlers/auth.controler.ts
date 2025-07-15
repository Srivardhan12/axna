import { Request, Response } from "express";
import bcrypt from "bcrypt"

const PASSWORD_MAIN = "$2b$10$jNtoYVnpoLhDWyack08JteQSeph.d82EceqIdbkMyF3aBIWLlrEHO"

export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    res.json({ email: email, password: password, hashedPassword: hashedPassword })
}

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.compare(password, PASSWORD_MAIN);
    res.json({ email: email, password: password, hashedPassword: hashedPassword })
}