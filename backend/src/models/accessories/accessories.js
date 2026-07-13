import { Schema, model } from "mongoose";

const accessoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    subtype: {
      type: String,
    },
    description: {
      type: String,
    },
    compatibleWith: [
      {
        type: String,
      },
    ],

    material: {
      type: String,
    },

    price: {
      type: Number,
    },

    images: [
      {
        type: String,
      },
    ],

    tags: [
      {
        type: String,
      },
    ],

    public_id: {
      type: String,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model("Accessories", accessoriesSchema);
