import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No Token Provided" })
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token)
        next()
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}