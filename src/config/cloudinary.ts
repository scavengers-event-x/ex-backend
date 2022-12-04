import { envVars } from './vars'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
  secure: true
})
