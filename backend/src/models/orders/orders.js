/*
Campos:
    customerId
    status
    items
        productId
        type
        title
        price
        image
        quantity
    subtotal
    shipping
    total
    shipping_address
        street
        city
        state
        country
    payment_method
    order_number
    notes
*/

import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        customerId: {
            type: mongoose.Types.ObjectId,
            ref: "Customers",
            required: true
        },

        status: {
            type: String,
            default: "pendiente"
        },

        items: [
            {
                productId: {
                    type: mongoose.Types.ObjectId
                },

                productModel: {
                    type: String,
                    enum: ["Vinyl", "CD", "Turntable", "Accessory"]
                },

                type: {
                    type: String
                },

                title: {
                    type: String
                },

                price: {
                    type: Number
                },

                image: {
                    type: String
                },

                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],

        subtotal: {
            type: Number
        },

        shipping: {
            type: Number
        },

        total: {
            type: Number
        },

        shipping_address: {
            street: {
                type: String
            },

            city: {
                type: String
            },

            state: {
                type: String
            },

            country: {
                type: String
            }
        },

        payment_method: {
            type: String
        },

        order_number: {
            type: String,
            unique: true
        },

        notes: {
            type: String
        }
    },
    {
        timestamps: true,
        strict: false
    });

export default model("orders", orderSchema);