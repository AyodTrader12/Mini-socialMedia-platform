import mongoose from "mongoose";
import env from "dotenv";
env.config()
export const connectDB = async ():Promise<void> => {
  try{
   const MONGO_DB = process.env.MONGO_URI as string
   if(!MONGO_DB) throw new Error("MongoDB URI is not defined in the environment variables")

    const conn = await mongoose.connect(MONGO_DB,{
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
        retryWrites: true,
        retryReads: true,   
        heartbeatFrequencyMS: 10000,

    })
    console.log(`MONGO DB CONNECTED 👍👍${conn.connection.host}`)
  }catch(error){
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error connecting to MongoDB:", message);
    process.exit(1);
  }
}

mongoose.connection.on("Connected",() => {
      console.log("✅ MongoDB connected");
})

mongoose.connection.on("Disconnected",() => {
        console.log("⚠️ MongoDB disconnected");
})

mongoose.connection.on("reconnected",() =>{
    console.log("🔄 MongoDB reconnected");
})

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err.message);
});

mongoose.connection.on("close", () => {
  console.log("🔌 MongoDB connection closed");
});
