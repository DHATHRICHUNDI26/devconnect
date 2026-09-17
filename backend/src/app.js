import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import express from "express"
import cors from "cors"
const app=express()

app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173"
}))

app.use("/api/v1/users",userRouter)
app.use("/api/v1/posts",postRouter)


export default app