import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import { connectDB } from './config/db.js'
dotenv.config()
const app = express()


// middlewares
app.use(cors())
app.use(express.json())
connectDB()

app.listen(process.env.PORT,()=>{
    console.log(`Server started on port: ${process.env.PORT}`);
})
