import jwt from "jsonwebtoken";
import {env }from "../config/env"
import {AppError }from "../config/AppError"

export function signToken(userId:string):string{
    return jwt.sign({sub:userId}, env.JWT_SECRET,
         {expiresIn: `${env.JWT_EXPIRES_IN_DAYS}d`})
}


export function verifyToken(token:string):string{
    try{
        const payload = jwt.verify(token,env.JWT_SECRET)
        if(typeof payload === "string" || !payload.sub){
            throw new Error("Bad payload")
        }
        return payload.sub
    }catch{
        throw new AppError(401, "Invalid or expired token")
    }
}