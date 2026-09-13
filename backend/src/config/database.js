import dns from "dns"
dns.setServers(["8.8.8.8"])
import mangoose from "mongoose"
const connectDB=async()=>{
    try {
        const connectionInstance=await mangoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n connected to mongodb at :${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB connection failed",error);
        process.exit(1);
    }
}
export default connectDB;
