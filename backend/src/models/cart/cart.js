import mongoose, { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    customer_id: {
      type: mongoose.Types.ObjectId,
      ref: "customers",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },

        type: {
          type: String,
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },

        added_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("cart", cartSchema);