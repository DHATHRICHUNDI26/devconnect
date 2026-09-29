import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import express from "express"
import cors from "cors"

const app=express()

app.use(cors({
    origin:process.env.FRONTEND_URL||"http://localhost:5173"
}))

app.use(express.json())

app.use("/api/v1/users",userRouter)
app.use("/api/v1/posts",postRouter)

export default app