import { Schema,model } from "mongoose";

const otpSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:["verify","reset"]
    },
    codeHash:{
        type:String,
        required:true
    },
    attempts:{
        type:Number,
        default:0
    },
    sentAt:{
        type:Date,
        default:Date.now
    },
    expiresAt:{
        type:Date,
        required:true
    }
})


// One active code per user per purpose
otpSchema.index({ user: 1, type: 1 }, { unique: true });

// MongoDB deletes the document automatically once expiresAt passes
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = model("otp", otpSchema)