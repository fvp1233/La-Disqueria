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