import env from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import { Request,Response } from "express";
import helmet from "helmet";
import { connectDB } from "./config/dataBase";
import { errorHandler } from "./middleware/errorHandler";
env.config()

const app:Application = express();
const PORT = process.env.PORT 
app.use(express.json())
app.use(cors())
app.use(helmet())
app.get("/health",(req:Request,res:Response)=> {
 res.status(200).json({message:"Server is running fine"})
})



app.use(errorHandler)


async function startServer(){
    await connectDB();
 app.listen(PORT,()=>{
    console.clear()
    console.log(`Server is running on port ${PORT}`)
})

}

startServer().catch((error)=>{
    console.error("Error starting the server:", error);
    process.exit(1);
})