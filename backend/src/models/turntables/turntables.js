/*
    -brand
    -model
    -type
    -description
    -specs [
        -driveType
        -speeds{String}
        -hasUsb
        -hasPreamp
        -output
        -torque
        -wow
    ]
    -waranty
    -price
    -images{String}
    -tags{String}
    -isAvailable
*/

import mongoose, {Schema, model}from 'mongoose'

const turntablesSchema = new Schema({
    brand: {
        type: String
    },
    model: {
        type: String
    },
    type:{
        type: String
    },
    description: {
        type: String
    },
    specs: [
        {
            driveType:{
                type: String
            },
            speeds: [
                {
                    type: String
                }
            ],
            hasUsb: {
                type: Boolean
            },
            hasPreamp: {
                type: String
            },
            output: {
                type: String
            },
            torque: {
                type: String
            },
            wow: {
                type: String
            }
        }
    ],
    warranty:{
        type: String
    },
    price: {
        type: Number
    },
    images: [
        {
            public_id: {
                type: String
            },
            image: {
                type:String
            }
        }
    ],
    tags: [
        {
            type: String
        }
    ],
    isAvailable: {
        type: Boolean
    }
})

export default model ("turntables", turntablesSchema)