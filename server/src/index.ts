import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors"
import authRoutes from "./routes/auth.routes"
import fearuteRoutes from "./routes/features.routes"
import storeQuiz from "./routes/store-quiz.route";
import retriveQuiz from "./routes/retrive-quiz.route";
import { connectDB } from "./database/mongoose.connect";

const app = express()

app.use(cors());
const PORT = process.env.PORT
app.use(express.json())

connectDB()

app.get("/", (req: Request, res: Response) => {
    res.send("Hello There")
})

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/feature", fearuteRoutes)
app.use("/api/v1/store", storeQuiz)
app.use("/api/v1/retrive", retriveQuiz)

app.listen(PORT, () => {
    console.log("server started")
})