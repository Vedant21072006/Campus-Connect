import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoute from './routes/authRoutes.js'
import { connectRedis } from './config/redis.js'
import cookieParser from 'cookie-parser'
import { tr } from 'zod/v4/locales'
import profileRoute from './routes/profileRoutes.js'
import postRoute from './routes/postRoute.js'
import friendRoute from './routes/friendRoutes.js'
dotenv.config()
const app = express()


// middlewares
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use('/api/auth',authRoute)
app.use('/api/profile',profileRoute)
app.use('/api/post',postRoute)
app.use('/api/friend',friendRoute)

await connectDB()
await connectRedis()
app.listen(process.env.PORT,()=>{
    console.log(`Server started on port: ${process.env.PORT}`);
})
