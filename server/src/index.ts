import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes"
import fearuteRoutes from "./routes/features.routes"

const app = express()

app.use(express.json())
const PORT = 8000

app.get("/", (req: Request, res: Response) => {
    res.send("Hello There")
})

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/feature", fearuteRoutes)

app.listen(PORT, () => {
    console.log("server started at port 8000")
})