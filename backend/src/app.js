import userRouter from "./routes/user.route.js"
import express from "express"
const app=express();
app.use(express.json());
app.use("/api/v1/users",userRouter);
export default app;