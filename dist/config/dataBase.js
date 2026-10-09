"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MONGO_DB = process.env.MONGO_URI;
        if (!MONGO_DB)
            throw new Error("MongoDB URI is not defined in the environment variables");
        const conn = yield mongoose_1.default.connect(MONGO_DB, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
            retryWrites: true,
            retryReads: true,
            heartbeatFrequencyMS: 10000,
        });
        console.log(`MONGO DB CONNECTED 👍👍${conn.connection.host}`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Error connecting to MongoDB:", message);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
mongoose_1.default.connection.on("Connected", () => {
    console.log("✅ MongoDB connected");
});
mongoose_1.default.connection.on("Disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
});
mongoose_1.default.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected");
});
mongoose_1.default.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err.message);
});
mongoose_1.default.connection.on("close", () => {
    console.log("🔌 MongoDB connection closed");
});
