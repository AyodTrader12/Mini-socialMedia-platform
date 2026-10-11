import { RequestHandler } from "express"
import { AppError } from "../config/AppError"
import { ZodType } from "zod"

export const validate = (schema:ZodType):RequestHandler => (req, _res, next) => {
const result = schema.safeParse(req.body)
 
if(!result.success){
    const errors = result.error.issues.map((issue) => {
        return {
            field: issue.path.join("."),
            message: issue.message
        }
    })
    next(new AppError(400,"validation failed",errors))
    return;
}


    req.body = result.data
    next()
}
