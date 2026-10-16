import multer ,{ FileFilterCallback } from "multer";
import { Request } from "express";
import {AppError} from "../config/AppError"

const IMAGE_TYPES = ["image/jpeg","image/png","image/webp"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

function imageFilter(req:Request,file:Express.Multer.File,cb:FileFilterCallback){
    if(!IMAGE_TYPES.includes(file.mimetype)){
        cb(new AppError(400,"only jpeg,png and webp images are allowed"))
        return
    }
    cb(null,true)
}

export const avatarUploads = multer({
    storage:multer.memoryStorage(),
    limits: {fileSize:MAX_IMAGE_SIZE,files:1},
    fileFilter:imageFilter,
}).single("avatar")

