/*
productId,
productType,
customerId,
customerName,
rating (1 - 5),
comment
*/
import mongoose, { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    productType: {
      type: String,
      enum: ["vinyl", "cd", "turntable", "accessory"],
    },
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: "Customers",
      required: true,
    },
    customerName: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Un cliente deja una sola valoración por producto; si vuelve a opinar se actualiza.
reviewSchema.index({ productId: 1, customerId: 1 }, { unique: true });

export default model("reviews", reviewSchema);
