import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { User } from "../models/auth.model";
import { generateToken } from "../utils/jwt";

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body
        const existUser = await User.findOne({ email })
        if (existUser) return res.status(400).json({ message: "User With This Email Already Exist" })

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username: username, email: email, password: hashedPassword })
        user.save()

        const token = generateToken({ username: user.username });

        res.status(200).json({ token: token, email: email, username: username });
    } catch (error) {
        res.status(500).json({ message: "Error", errorMessage: error })
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const existUser = await User.findOne({ email })
        if (!existUser) return res.status(401).json({ message: "User not found" })
        const hashedPassword = await bcrypt.compare(password, existUser.password);
        if (!hashedPassword) return res.status(401).json({ message: "Invalid credentials" });

        const token = generateToken({ username: existUser.username });

        res.status(200).json({ token: token, email: email, username: existUser.username });
    } catch (error) {
        res.status(500).json({ message: "Error", errorMessage: error })
    }
}