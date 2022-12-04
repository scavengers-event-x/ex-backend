import * as path from 'path'
import * as dotenv from 'dotenv-safe'

// import .env variables
dotenv.config({
  path: path.join(process.cwd(), './.env'),
  sample: path.join(process.cwd(), './.env.example')
})

export const envVars = {
  DB_NAME: process.env.DB_NAME,
  DB_PASS: process.env.DB_PASS,
  DB_URL: process.env.DB_URL,
  DB_USER: process.env.DB_USER,
  ENVIRONMENT: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MAILER_USER: process.env.MAILER_USER,
  MAILER_PASS: process.env.MAILER_PASS,
  MAILER_PORT: parseInt(process.env.MAILER_PORT),
  MAILER_HOST: process.env.MAILER_HOST,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}
