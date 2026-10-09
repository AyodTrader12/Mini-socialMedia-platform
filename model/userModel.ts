import { Schema,model,InferSchemaType } from "mongoose";


const providerSchema = new Schema(
    {
     providerName:{
        type:String,
        enum:["google","microsoft"],
        required:true
     },
     providerId:{
        type:String,
        required:true
     }
    },
    {_id:false}
)

const userSchema = new Schema(
    {
        userName:{
         type:String,
         required:true,
         unique:true,
         lowercase:true,
         minlength:3,
         maxlength:20,
         trim:true
        },
        email:{
            type:String,
            unique:true,
            required:true,
            trim:true,
            lowercase:true,
        },
        passwordHash:{
            type:String,
            select:false,
        },
        providers:{
            type:[providerSchema],
            default:[]
        },
        avatar:{
            type:String,
        }
    },
    {timestamps:true}
)

userSchema.index({"providers.providerId":1,"providers.providerName":1})

export type User = InferSchemaType<typeof userSchema>
export const user = model("user", userSchema)