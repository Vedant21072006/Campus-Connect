
import { registerSchema } from "../validators/auth.validator.js";
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import { success } from "zod";

export const register=async(req,resp)=>{
  try{
     let {name,email,password} = req.body;
     let validation = registerSchema.safeParse({name,email,password})

     if(!validation.success){
       return resp.status(400).json({
          success:false,
          message:validation.error.issues
       })
     }

     const user = await User.findOne({email})
     if(user){
        return resp.json({
            success:false,
            message:'User already exists'
        })
     }
     const hashedPassword =await bcrypt.hash(password,10)
     let newUser= await User.create({
        name:name,
        email:email,
        passwordHash:hashedPassword
     })

     return resp.status(200).json({
        success:'true',
        message:'registered user and otp sent'
     })    



  }
  catch(error){
    return resp.status(500).json({
        success:false,
        message:error.message
    })
  }
  
}