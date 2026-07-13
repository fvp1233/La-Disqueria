/*
name,
last_name,
email,
password,
phone,
adreesses[{
street,
city
}],
isActive
*/
import { Schema, model } from "mongoose";

const customerSchema = new Schema(
  {
    name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    addresses: [
      {
        street: {
          type: String,
        },
        city: {
          type: String,
        },
      },
    ],
    is_active: {
      type: Boolean,
    },
    isVerified: {
      type: Boolean,
    },
    loginAttemps: {
      type: Number,
    },
    timeOut: {
      type: Date,
    },
  },
  {
    timestamps: true,
    strict: false,
  },
);
export default model("Customers", customerSchema);
