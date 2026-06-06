/*
 -company
 -contact_name
 -email
 -phone
 -country
 -city
 -catalog[
    {
        type
        title
        price
        isAvailable
    }
 ]
 */

import mongoose,{Schema, model} from 'mongoose'


const catalogItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['vinyl', 'turntable'], //enum valida que solamente entren esos dos valores
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const supplierSchema = new Schema ({
    companny: {
        type: String
    },
    contact_name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    catalog: [
        {
            type: {
                type: String
            },
            title: {
                type: String
            },
            price: {
                type: Number
            },
            isAvailable: {
                type: Boolean
            }
        }
    ]
})

export default model ("suppliers", supplierSchema)