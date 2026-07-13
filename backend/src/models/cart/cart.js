import mongoose, { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    customer_id: {
      type: mongoose.Types.ObjectId,
      ref: "Customers",
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

    // "active" mientras el cliente sigue agregando productos, "comprado"
    // una vez que confirma la compra simulada desde /pedido.
    status: {
      type: String,
      enum: ["active", "comprado"],
      default: "active",
    },

    subtotal: {
      type: Number,
    },

    shipping: {
      type: Number,
    },

    total: {
      type: Number,
    },

    shipping_address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
    },

    payment_method: {
      type: String,
    },

    notes: {
      type: String,
    },

    order_number: {
      type: String,
    },

    purchased_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("cart", cartSchema);
