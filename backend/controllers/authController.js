
import { loginValidation, registerSchema, verifyOTPSchema } from "../validators/auth.validator.js";
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import redisClient from "../config/redis.js";
import { generateOTP } from "../util/otp.js";
import { sendOTPEmail } from "../util/sendotp.js";
import { success } from "zod";

export const register = async (req, resp) => {
   try {
      let { name, email, password } = req.body;
      let validation = registerSchema.safeParse({ name, email, password })

      if (!validation.success) {
         return resp.status(400).json({
            success: false,
            message: validation.error.issues
         })
      }

      const user = await User.findOne({ email })

      if (user && user.isVerified) {
         return resp.status(409).json({
            success: false,
            status: 'VERIFIED_USER',
            message: 'Account already exists. Please login.'
         });
      }

   if (user && !user.isVerified) {

   const otp = generateOTP();

   await redisClient.set(
      `otp:${user._id}`,
      otp,
      { EX: 300 }
   );

   await sendOTPEmail(email, otp);

   console.log('Resent OTP:', otp);

   return resp.status(200).json({
      success: true,
      status: 'UNVERIFIED_USER',
      userId: user._id,
      message: 'Account exists but is not verified. OTP resent.'
   });
}
      
      const hashedPassword = await bcrypt.hash(password, 10)
      let newUser = await User.create({
         username: name,
         email: email,
         passwordHash: hashedPassword
      })

      let otp = generateOTP()
      await redisClient.set(
         `otp:${newUser._id}`,
         otp,
         {
            EX: 300
         }
      )
      console.log('OTP', otp);

      await sendOTPEmail(email, otp)


      return resp.status(201).json({
         success: true,
         userId: newUser._id,
         status: 'NEW_USER',
         message: 'registered user and otp sent'
      })
 
   }
   catch (error) {
      console.log(error.message);
      
      return resp.status(500).json({
         success: false,
         message: error.message
      })
   }

}

export const verifyotp = async (req, resp) => {
   try {

      const validation = verifyOTPSchema.safeParse(req.body)
      if (!validation.success) {
         return resp.status(400).json({
            success: false,
            message: validation.error.issues

         })
      }
      const { userId, otp } = req.body

      const storedOTP = await redisClient.get(`otp:${userId}`);

      if (!storedOTP) {
         return resp.status(404).json({
            message: 'Otp expired or not found',
            success: false
         })
      }
      if (storedOTP !== otp) {
         return resp.status(400).json({
            message: 'Invalid otp',
            success: false
         })
      }
      const user = await User.findByIdAndUpdate(
         userId,
         {
            isVerified: true,
         },
         { new: true }
      );

      await redisClient.del(`otp:${userId}`);

      const token = jwt.sign(
         {
            _id: user._id,
            role: user.role
         },
         process.env.SECRET_KEY,
         { expiresIn: '7d' }
      );

      // Set HTTP-only cookie
      resp.cookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
         maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Update last login
      user.lastLogin = new Date();
      await user.save();


      return resp.status(200).json({
         success: true,
         message: 'Email verified successfully'
      });


   }
   catch (error) {
      return resp.status(500).json({
         message: error.message,
         success: false
      })
   }
}

export const login = async (req, resp) => {
   try {

      // Validate request
      const validation =loginValidation.safeParse(req.body)

      if (!validation.success) {
         return resp.status(400).json({
            success: false,
            message: validation.error.issues
         });
      }

      const { email, password } = validation.data;

      // Find user
      const user = await User.findOne({ email });

      if (!user) {
         return resp.status(400).json({
            success: false,
            message: 'Invalid email or password'
         });
      }

      // Check email verification
      if (!user.isVerified) {
         return resp.status(403).json({
            success: false,
            message: 'Please verify your email first'
         });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
         return resp.status(400).json({
            success: false,
            message: 'Invalid email or password'
         });
      }

      // Generate JWT
      const token = jwt.sign(
         {
            _id: user._id,
            role: user.role
         },
         process.env.SECRET_KEY,
         { expiresIn: '7d' }
      );

      // Set HTTP-only cookie
      resp.cookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
         maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      return resp.status(200).json({
         success: true,
         message: 'Logged in successfully',
         user: {
            _id: user._id,
            name: user.username,
            email: user.email,
            role: user.role
         }
      });

   } catch (error) {
      return resp.status(500).json({
         success: false,
         message: error.message
      });
   }
};

export const logout = async (req, resp) => {
  try {

    resp.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return resp.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: error.message
    });
  }
};