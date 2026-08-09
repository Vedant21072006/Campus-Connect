import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "FOUND" : "MISSING",
  apiKey: process.env.CLOUDINARY_API_KEY ? "FOUND" : "MISSING",
  apiSecret: process.env.CLOUDINARY_API_SECRET ? "FOUND" : "MISSING",
});

export default cloudinary;