import dotenv from "dotenv"
import connectDB from "./config/database.js"
import app from "./app.js"

dotenv.config({
    path:"./.env"
})

const startServer=async()=>{
    try{
        await connectDB()

        const PORT=process.env.PORT||4000

        app.listen(PORT,"0.0.0.0",()=>{
            console.log(`listening on port:${PORT}`)
        })
    }catch(error){
        console.log("connection failed",error)
    }
}

startServer()