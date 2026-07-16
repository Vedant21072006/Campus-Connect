import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoute from './routes/authRoutes.js'
dotenv.config()
const app = express()


// middlewares
app.use(cors())
app.use(express.json())
app.use('/api/auth',authRoute)

connectDB()

app.listen(process.env.PORT,()=>{
    console.log(`Server started on port: ${process.env.PORT}`);
})
