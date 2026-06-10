import dotenv from "dotenv";

dotenv.config();

export const config = {
  DB_URI: process.env.DB_URI,

  JWT: {
    secret: process.env.JWT_Secret_key,
  },

  email: {
    user_email: process.env.USER_EMAIL,
    password_email: process.env.USER_PASSWORD,
  },

  cloudinary: {
    cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};